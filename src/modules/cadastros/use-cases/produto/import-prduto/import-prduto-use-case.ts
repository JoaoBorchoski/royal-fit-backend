import { IClienteDTO } from "@modules/cadastros/dtos/i-cliente-dto"
import { IFuncionarioDTO } from "@modules/cadastros/dtos/i-funcionario-dto"
import { IProdutoDTO } from "@modules/cadastros/dtos/i-produto-dto"
import { IClienteRepository } from "@modules/cadastros/repositories/i-cliente-repository"
import { IProdutoRepository } from "@modules/cadastros/repositories/i-produto-repository"
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
class ImportProdutoUseCase {
  constructor(
    @inject("ProdutoRepository")
    private produtoRepository: IProdutoRepository
  ) {}

  async importExcelData(row: any): Promise<IProdutoDTO> {
    const produto: IProdutoDTO = {
      nome: row["nome"],
      preco: row["preco"],
    }

    return produto
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
        const produto = await this.importExcelData(row)
        const teste = await this.produtoRepository.createWithQueryRunner(produto, queryRunner.manager)
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

export { ImportProdutoUseCase }
