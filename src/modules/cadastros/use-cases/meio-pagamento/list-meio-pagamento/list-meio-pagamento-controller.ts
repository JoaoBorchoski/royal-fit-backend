import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListMeioPagamentoUseCase } from './list-meio-pagamento-use-case'

class ListMeioPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search,
      page,
      pageSize,
      order,
      filter
    } = request.body

    const listMeioPagamentoUseCase = container.resolve(ListMeioPagamentoUseCase)

    const meiosPagamento = await listMeioPagamentoUseCase.execute({
      search: search as string,
      page: Number(page) as number,
      rowsPerPage: Number(pageSize) as number,
      order: order as string,
      filter: filter as string
    })

    return response.json(meiosPagamento)
  }
}

export { ListMeioPagamentoController }
