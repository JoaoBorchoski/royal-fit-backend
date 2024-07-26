import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { MultiDeletePedidoBonificadoUseCase } from './multi-delete-pedido-bonificado-use-case'
import { ListPedidoBonificadoUseCase } from '../list-pedido-bonificado/list-pedido-bonificado-use-case'

class MultiDeletePedidoBonificadoController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete multi record

    const ids = request.body
    const multiDeletePedidoBonificadoUseCase = container.resolve(MultiDeletePedidoBonificadoUseCase)
    await multiDeletePedidoBonificadoUseCase.execute(ids)


    // restore list with updated records

    const listPedidoBonificadoUseCase = container.resolve(ListPedidoBonificadoUseCase)
    const pedidoBonificados = await listPedidoBonificadoUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(pedidoBonificados)
  }
}

export { MultiDeletePedidoBonificadoController }
