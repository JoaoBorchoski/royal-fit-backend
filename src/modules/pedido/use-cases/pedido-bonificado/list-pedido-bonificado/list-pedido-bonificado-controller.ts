import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListPedidoBonificadoUseCase } from './list-pedido-bonificado-use-case'

class ListPedidoBonificadoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search,
      page,
      pageSize,
      order,
      filter
    } = request.body

    const listPedidoBonificadoUseCase = container.resolve(ListPedidoBonificadoUseCase)

    const pedidoBonificados = await listPedidoBonificadoUseCase.execute({
      search: search as string,
      page: Number(page) as number,
      rowsPerPage: Number(pageSize) as number,
      order: order as string,
      filter: filter as string
    })

    return response.json(pedidoBonificados)
  }
}

export { ListPedidoBonificadoController }
