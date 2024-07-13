import { Request, Response } from "express"
import { container } from "tsyringe"
import { ExportGarrafaoExcelUseCase } from "./export-garrafao-use-case"

class ExportGarrafaoExcelController {
  async handle(request: Request, response: Response): Promise<Response> {
    const exportGarrafaoExcelUseCase = container.resolve(ExportGarrafaoExcelUseCase)
    const excelData = await exportGarrafaoExcelUseCase.execute()

    return response.status(excelData.statusCode).json(excelData.data)
  }
}

export { ExportGarrafaoExcelController }
