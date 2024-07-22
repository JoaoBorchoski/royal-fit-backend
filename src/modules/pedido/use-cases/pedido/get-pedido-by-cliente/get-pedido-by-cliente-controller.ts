import { Request, Response } from "express"
import { container } from "tsyringe"
import { GetPedidoByClienteUseCase } from "./get-pedido-by-cliente-use-case"

class GetPedidoByClienteController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.params.id
    const getPedidoByClienteUseCase = container.resolve(GetPedidoByClienteUseCase)
    const pedido = await getPedidoByClienteUseCase.execute(id)

    return response.status(pedido.statusCode).json(pedido.data)
  }
}

export { GetPedidoByClienteController }
