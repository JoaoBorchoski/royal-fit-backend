import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetPedidoBonificadoUseCase } from './get-pedido-bonificado-use-case'

class GetPedidoBonificadoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.params.id
    const getPedidoBonificadoUseCase = container.resolve(GetPedidoBonificadoUseCase)
    const pedidoBonificado = await getPedidoBonificadoUseCase.execute(id)

    return response.status(pedidoBonificado.statusCode).json(pedidoBonificado.data)
  }
}

export { GetPedidoBonificadoController }
