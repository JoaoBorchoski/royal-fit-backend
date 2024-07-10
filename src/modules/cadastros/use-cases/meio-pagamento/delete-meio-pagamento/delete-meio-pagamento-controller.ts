import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { DeleteMeioPagamentoUseCase } from './delete-meio-pagamento-use-case'
import { ListMeioPagamentoUseCase } from '../list-meio-pagamento/list-meio-pagamento-use-case'

class DeleteMeioPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete record
    
    const id = request.params.id
    const deleteMeioPagamentoUseCase = container.resolve(DeleteMeioPagamentoUseCase)
    await deleteMeioPagamentoUseCase.execute(id)


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

export { DeleteMeioPagamentoController }
