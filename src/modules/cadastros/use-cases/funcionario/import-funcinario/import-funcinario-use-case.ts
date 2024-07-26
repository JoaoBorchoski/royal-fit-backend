import { IUserRepository } from "@modules/authentication/repositories/i-user-repository"
import { IFuncionarioDTO } from "@modules/cadastros/dtos/i-funcionario-dto"
import { IProdutoDTO } from "@modules/cadastros/dtos/i-produto-dto"
import { IFuncionarioRepository } from "@modules/cadastros/repositories/i-funcionario-repository"
import { IProdutoRepository } from "@modules/cadastros/repositories/i-produto-repository"
import { IProfileRepository } from "@modules/security/repositories/i-profile-repository"
import { IUserGroupRepository } from "@modules/security/repositories/i-user-group-repository"
import { IUserProfileRepository } from "@modules/security/repositories/i-user-profile-repository"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse, noContent, ok } from "@shared/helpers"
import { hash } from "bcrypt"
import fs from "fs"
import moment from "moment"
import { inject, injectable } from "tsyringe"
import { getConnection } from "typeorm"
import xlsx from "xlsx"
interface IRequest {
  file: Express.Multer.File
}

@injectable()
class ImportFuncionarioUseCase {
  constructor(
    @inject("FuncionarioRepository")
    private funcionarioRepository: IFuncionarioRepository,
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("UserGroupRepository")
    private userGroupRepository: IUserGroupRepository,
    @inject("UserProfileRepository")
    private userProfileRepository: IUserProfileRepository,
    @inject("ProfileRepository")
    private profileRepository: IProfileRepository
  ) {}

  async importExcelData(row: any): Promise<IFuncionarioDTO> {
    const funcionario: IFuncionarioDTO = {
      nome: row["nome"],
      cpf: row["cpf"].toString().replace(/[^\d]+/g, ""),
      email: row["email"],
      telefone: row["telefone"],
    }

    return funcionario
  }

  private async parseExcelFile(file: Express.Multer.File): Promise<any[]> {
    return new Promise((resolve) => {
      const fileContent = fs.readFileSync(file.path)
      const workbook = xlsx.read(fileContent, { type: "buffer" })
      const sheetNames = workbook.SheetNames
      const excelData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]])

      resolve(excelData)
    })
  }

  async execute(request: IRequest): Promise<HttpResponse> {
    const { file } = request
    const queryRunner = getConnection().createQueryRunner()
    await queryRunner.startTransaction()
    const userGroupId = await this.userGroupRepository.getByName("royalfit")
    let index = 0

    let errors = []

    try {
      const rows = await this.parseExcelFile(file)
      for await (const row of rows) {
        index++
        const funcionario = await this.importExcelData(row)
        const alreadyExists = await this.userRepository.findByEmailWithQueryRunner(funcionario.email, queryRunner.manager)
        const profileId = await this.profileRepository.getByName(row["Nível de Acesso"], queryRunner.manager)

        if (alreadyExists) {
          throw new AppError("Funcionários com email duplicado não são permitidos.")
        }

        if (!profileId.data) {
          throw new AppError(`Nível de Acesso não encontrado.`)
        }

        const passwordBtoa = btoa(funcionario.cpf)
        const passwordHash = await hash(passwordBtoa, 8)
        const resultCreateUser = await this.userRepository.createWithQueryRunner(
          {
            userGroupId: userGroupId.data.id,
            name: funcionario.nome,
            login: funcionario.email,
            password: passwordHash,
            isAdmin: false,
            isSuperUser: false,
            isBlocked: false,
            blockReasonId: null,
            mustChangePasswordNextLogon: true,
            avatar: null,
            isDisabled: false,
          },
          queryRunner.manager
        )
        funcionario.usuarioId = resultCreateUser.id

        await this.userProfileRepository.createWithQueryRunner(
          {
            userId: resultCreateUser.id,
            profileId: profileId.data.id,
          },
          queryRunner.manager
        )

        const teste = await this.funcionarioRepository.createWithQueryRunner(funcionario, queryRunner.manager)
      }

      fs.unlinkSync(file.path)
      if (errors.length > 0) {
        await queryRunner.commitTransaction()
        return ok({
          warning: "Arquivo possui informações incorretas!\nConsultar aquivo para mais informações",
          errors: errors,
        })
      }
      await queryRunner.commitTransaction()
      return noContent()
    } catch (error) {
      fs.unlinkSync(file.path)
      await queryRunner.rollbackTransaction()
      return error
    } finally {
      await queryRunner.release()
    }
  }
}

export { ImportFuncionarioUseCase }
