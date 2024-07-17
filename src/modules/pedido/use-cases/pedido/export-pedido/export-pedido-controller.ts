import { Request, Response } from "express"
import { container } from "tsyringe"
import { ExportPedidoExcelUseCase } from "./export-pedido-use-case"

class ExportPedidoExcelController {
  async handle(request: Request, response: Response): Promise<Response> {
    const exportPedidoExcelUseCase = container.resolve(ExportPedidoExcelUseCase)
    const excelData = await exportPedidoExcelUseCase.execute()

    return response.status(excelData.statusCode).json(excelData.data)
  }
}

export { ExportPedidoExcelController }
