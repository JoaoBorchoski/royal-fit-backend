import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CountPedidoBonificadoUseCase } from './count-pedido-bonificado-use-case'

class CountPedidoBonificadoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search
    } = request.body

    const countPedidoBonificadoUseCase = container.resolve(CountPedidoBonificadoUseCase)

    const pedidoBonificadosCount = await countPedidoBonificadoUseCase.execute({
      search: search as string
    })

    return response.status(pedidoBonificadosCount.statusCode).json(pedidoBonificadosCount)
  }
}

export { CountPedidoBonificadoController }
