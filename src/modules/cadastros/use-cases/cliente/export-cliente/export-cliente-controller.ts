import { Request, Response } from "express"
import { container } from "tsyringe"
import { ExportClienteExcelUseCase } from "./export-cliente-use-case"

class ExportClienteExcelController {
  async handle(request: Request, response: Response): Promise<Response> {
    const exportClienteExcelUseCase = container.resolve(ExportClienteExcelUseCase)
    const excelData = await exportClienteExcelUseCase.execute()

    return response.status(excelData.statusCode).json(excelData.data)
  }
}

export { ExportClienteExcelController }
