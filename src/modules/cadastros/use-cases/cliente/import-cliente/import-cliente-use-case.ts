import { IClienteDTO } from "@modules/cadastros/dtos/i-cliente-dto"
import { IFuncionarioDTO } from "@modules/cadastros/dtos/i-funcionario-dto"
import { IBonificacaoRepository } from "@modules/cadastros/repositories/i-bonificacao-repository"
import { IClienteRepository } from "@modules/cadastros/repositories/i-cliente-repository"
import { IGarrafaoRepository } from "@modules/cadastros/repositories/i-garrafao-repository"
import { IBalancoRepository } from "@modules/clientes/repositories/i-balanco-repository"
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
class ImportClienteUseCase {
  constructor(
    @inject("ClienteRepository")
    private clienteRepository: IClienteRepository,
    @inject("BonificacaoRepository")
    private bonificacaoRepository: IBonificacaoRepository,
    @inject("GarrafaoRepository")
    private garrafaoRepository: IGarrafaoRepository,
    @inject("BalancoRepository")
    private balancoRepository: IBalancoRepository
  ) {}

  async importExcelData(row: any): Promise<IFuncionarioDTO> {
    const returnTrueOrFalse = (row: any) => {
      if (!row) {
        return false
      }
      if (typeof row === "boolean") {
        return row
      }
      if (row.toString().toLowerCase() === "sim") {
        return true
      }
      if (row.toString().toLowerCase() === "nao" || row.toString().toLowerCase() === "não") {
        return false
      }
    }

    const cliente: IClienteDTO = {
      nome: row["nome"],
      cpfCnpj: row["cpfCnpj"].toString().replace(/[^\d]+/g, ""),
      email: row["email"],
      telefone: row["telefone"],
      isBonificado: returnTrueOrFalse(row["Bonificacao Disponivel"]),
      desconto: row["desconto"],
    }

    return cliente
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
        const cliente = await this.importExcelData(row)
        const teste = await this.clienteRepository.createWithQueryRunner(cliente, queryRunner.manager)
        const bonificacaoAlreadyExists = await this.bonificacaoRepository.getByClienteId(teste.data.id)
        const balancoAlreadyExists = await this.balancoRepository.getByClienteId(teste.data.id)
        const garrafaAlreadyExists = await this.garrafaoRepository.getByClienteId(teste.data.id)

        if (!bonificacaoAlreadyExists.data) {
          await this.bonificacaoRepository.createWithQueryRunner(
            {
              clienteId: teste.data.id,
              bonificacaoDisponivel: 0,
              totalVendido: 0,
              desabilitado: false,
            },
            queryRunner.manager
          )
        }
        if (!balancoAlreadyExists.data) {
          await this.balancoRepository.createWithQueryRunner(
            {
              clienteId: teste.data.id,
              saldoDevedor: 0,
              desabilitado: false,
            },
            queryRunner.manager
          )
        }

        if (!garrafaAlreadyExists.data) {
          await this.garrafaoRepository.createWithQueryRunner(
            {
              clienteId: teste.data.id,
              quantidade: 0,
              desabilitado: false,
            },
            queryRunner.manager
          )
        }
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
      console.log(error)
      fs.unlinkSync(file.path)
      await queryRunner.rollbackTransaction()
      return error
    } finally {
      await queryRunner.release()
    }
  }
}

export { ImportClienteUseCase }
