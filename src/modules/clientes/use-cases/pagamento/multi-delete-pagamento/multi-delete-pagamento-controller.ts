import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { MultiDeletePagamentoUseCase } from './multi-delete-pagamento-use-case'
import { ListPagamentoUseCase } from '../list-pagamento/list-pagamento-use-case'

class MultiDeletePagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete multi record

    const ids = request.body
    const multiDeletePagamentoUseCase = container.resolve(MultiDeletePagamentoUseCase)
    await multiDeletePagamentoUseCase.execute(ids)


    // restore list with updated records

    const listPagamentoUseCase = container.resolve(ListPagamentoUseCase)
    const pagamentos = await listPagamentoUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(pagamentos)
  }
}

export { MultiDeletePagamentoController }
