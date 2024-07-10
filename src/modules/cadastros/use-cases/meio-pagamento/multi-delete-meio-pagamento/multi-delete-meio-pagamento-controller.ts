import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { MultiDeleteMeioPagamentoUseCase } from './multi-delete-meio-pagamento-use-case'
import { ListMeioPagamentoUseCase } from '../list-meio-pagamento/list-meio-pagamento-use-case'

class MultiDeleteMeioPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete multi record

    const ids = request.body
    const multiDeleteMeioPagamentoUseCase = container.resolve(MultiDeleteMeioPagamentoUseCase)
    await multiDeleteMeioPagamentoUseCase.execute(ids)


    // restore list with updated records

    const listMeioPagamentoUseCase = container.resolve(ListMeioPagamentoUseCase)
    const meiosPagamento = await listMeioPagamentoUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(meiosPagamento)
  }
}

export { MultiDeleteMeioPagamentoController }
