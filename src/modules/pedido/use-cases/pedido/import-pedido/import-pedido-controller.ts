import { Request, Response } from "express"
import { container } from "tsyringe"
import { ImportPedidoUseCase } from "./import-pedido-use-case"

class ImportPedidoController {
  async handle(request: Request, response: Response): Promise<Response> {
    if (!request.file) {
      return response.status(400).json({ error: "Nenhum arquivo foi enviado." })
    }
    const importPedidoUseCase = container.resolve(ImportPedidoUseCase)

    const result = await importPedidoUseCase.execute({
      file: request.file,
    })

    return response.status(result.statusCode).send(result)
  }
}

export { ImportPedidoController }
