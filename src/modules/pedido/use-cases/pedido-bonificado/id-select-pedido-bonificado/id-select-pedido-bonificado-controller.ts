import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IdSelectPedidoBonificadoUseCase } from './id-select-pedido-bonificado-use-case'

class IdSelectPedidoBonificadoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const idSelectPedidoBonificadoUseCase = container.resolve(IdSelectPedidoBonificadoUseCase)

    const pedidoBonificado = await idSelectPedidoBonificadoUseCase.execute({
      id: id as string
    })

    return response.json(pedidoBonificado.data)
  }
}

export { IdSelectPedidoBonificadoController }
