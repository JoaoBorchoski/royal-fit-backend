import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { SelectPedidoBonificadoUseCase } from './select-pedido-bonificado-use-case'

class SelectPedidoBonificadoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filter } = request.query

    const selectPedidoBonificadoUseCase = container.resolve(SelectPedidoBonificadoUseCase)

    const pedidoBonificados = await selectPedidoBonificadoUseCase.execute({
      filter: filter as string,
    })

    return response.json(pedidoBonificados)
  }
}

export { SelectPedidoBonificadoController }
