import { IBonificacaoDTO } from "@modules/cadastros/dtos/i-bonificacao-dto"
import { IClienteDTO } from "@modules/cadastros/dtos/i-cliente-dto"
import { IFuncionarioDTO } from "@modules/cadastros/dtos/i-funcionario-dto"
import { IGarrafaoDTO } from "@modules/cadastros/dtos/i-garrafao-dto"
import { IBonificacaoRepository } from "@modules/cadastros/repositories/i-bonificacao-repository"
import { IClienteRepository } from "@modules/cadastros/repositories/i-cliente-repository"
import { IGarrafaoRepository } from "@modules/cadastros/repositories/i-garrafao-repository"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse, noContent, ok } from "@shared/helpers"
import fs from "fs"
import moment from "moment"
import { inject, injectable } from "tsyringe"
import { getConnection } from "typeorm"
import xlsx from "xlsx"
interface IRequest {
  file: Express.Multer.File
}

@injectable()
class ImportBonificacaoUseCase {
  constructor(
    @inject("BonificacaoRepository")
    private bonificacaoRepository: IBonificacaoRepository,
    @inject("ClienteRepository")
    private clienteRepository: IClienteRepository
  ) {}

  async importExcelData(row: any): Promise<IBonificacaoDTO> {
    const dividirPorDezSemDecimais = (numero: number): number => {
      return Math.floor(numero / 10)
    }

    const cliente = await this.clienteRepository.getByCpfCnpj(row["cpfCnpj"].toString().replace(/[^\d]+/g, ""))

    if (!cliente.data) {
      throw new AppError("Cliente não encontrado")
    }

    const clienteResult: IBonificacaoDTO = {
      clienteId: cliente.data.id,
      totalVendido: row["totalVendido"],
      bonificacaoDisponivel: dividirPorDezSemDecimais(+row["totalVendido"]),
    }

    return clienteResult
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

    let errors = []

    try {
      const rows = await this.parseExcelFile(file)
      for await (const row of rows) {
        const bonificacao = await this.importExcelData(row)
        const teste = await this.bonificacaoRepository.createWithQueryRunner(bonificacao, queryRunner.manager)
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

export { ImportBonificacaoUseCase }
