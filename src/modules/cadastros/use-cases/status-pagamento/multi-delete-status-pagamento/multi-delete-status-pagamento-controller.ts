import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { MultiDeleteStatusPagamentoUseCase } from './multi-delete-status-pagamento-use-case'
import { ListStatusPagamentoUseCase } from '../list-status-pagamento/list-status-pagamento-use-case'

class MultiDeleteStatusPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete multi record

    const ids = request.body
    const multiDeleteStatusPagamentoUseCase = container.resolve(MultiDeleteStatusPagamentoUseCase)
    await multiDeleteStatusPagamentoUseCase.execute(ids)


    // restore list with updated records

    const listStatusPagamentoUseCase = container.resolve(ListStatusPagamentoUseCase)
    const statusPagamento = await listStatusPagamentoUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(statusPagamento)
  }
}

export { MultiDeleteStatusPagamentoController }
