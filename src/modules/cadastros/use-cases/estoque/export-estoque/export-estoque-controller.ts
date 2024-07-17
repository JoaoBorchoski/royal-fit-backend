import { Request, Response } from "express"
import { container } from "tsyringe"
import { ExportEstoqueExcelUseCase } from "./export-estoque-use-case"

class ExportEstoqueExcelController {
  async handle(request: Request, response: Response): Promise<Response> {
    const exportEstoqueExcelUseCase = container.resolve(ExportEstoqueExcelUseCase)
    const excelData = await exportEstoqueExcelUseCase.execute()

    return response.status(excelData.statusCode).json(excelData.data)
  }
}

export { ExportEstoqueExcelController }
