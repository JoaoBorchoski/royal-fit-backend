import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListPagamentoUseCase } from './list-pagamento-use-case'

class ListPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search,
      page,
      pageSize,
      order,
      filter
    } = request.body

    const listPagamentoUseCase = container.resolve(ListPagamentoUseCase)

    const pagamentos = await listPagamentoUseCase.execute({
      search: search as string,
      page: Number(page) as number,
      rowsPerPage: Number(pageSize) as number,
      order: order as string,
      filter: filter as string
    })

    return response.json(pagamentos)
  }
}

export { ListPagamentoController }
