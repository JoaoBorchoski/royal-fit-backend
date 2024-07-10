import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListStatusPagamentoUseCase } from './list-status-pagamento-use-case'

class ListStatusPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search,
      page,
      pageSize,
      order,
      filter
    } = request.body

    const listStatusPagamentoUseCase = container.resolve(ListStatusPagamentoUseCase)

    const statusPagamento = await listStatusPagamentoUseCase.execute({
      search: search as string,
      page: Number(page) as number,
      rowsPerPage: Number(pageSize) as number,
      order: order as string,
      filter: filter as string
    })

    return response.json(statusPagamento)
  }
}

export { ListStatusPagamentoController }
