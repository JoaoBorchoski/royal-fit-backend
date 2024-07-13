import { Request, Response } from "express"
import { container } from "tsyringe"
import { ExportBonificacaoExcelUseCase } from "./export-bonificacao-use-case"

class ExportBonificacaoExcelController {
  async handle(request: Request, response: Response): Promise<Response> {
    const exportBonificacaoExcelUseCase = container.resolve(ExportBonificacaoExcelUseCase)
    const excelData = await exportBonificacaoExcelUseCase.execute()

    return response.status(excelData.statusCode).json(excelData.data)
  }
}

export { ExportBonificacaoExcelController }
