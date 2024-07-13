import { Request, Response } from "express"
import { container } from "tsyringe"
import { ExportProdutoExcelUseCase } from "./export-produto-use-case"

class ExportProdutoExcelController {
  async handle(request: Request, response: Response): Promise<Response> {
    const exportProdutoExcelUseCase = container.resolve(ExportProdutoExcelUseCase)
    const excelData = await exportProdutoExcelUseCase.execute()

    return response.status(excelData.statusCode).json(excelData.data)
  }
}

export { ExportProdutoExcelController }
