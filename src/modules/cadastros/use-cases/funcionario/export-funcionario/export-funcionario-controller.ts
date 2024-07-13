import { Request, Response } from "express"
import { container } from "tsyringe"
import { ExportFornecedorExcelUseCase } from "./export-funcionario-use-case"

class ExportFornecedorExcelController {
  async handle(request: Request, response: Response): Promise<Response> {
    const exportTabelaPrecoExcelUseCase = container.resolve(ExportFornecedorExcelUseCase)
    const excelData = await exportTabelaPrecoExcelUseCase.execute()

    return response.status(excelData.statusCode).json(excelData.data)
  }
}

export { ExportFornecedorExcelController }
