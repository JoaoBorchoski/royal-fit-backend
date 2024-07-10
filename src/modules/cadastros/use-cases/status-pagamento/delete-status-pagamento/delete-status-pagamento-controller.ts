import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { DeleteStatusPagamentoUseCase } from './delete-status-pagamento-use-case'
import { ListStatusPagamentoUseCase } from '../list-status-pagamento/list-status-pagamento-use-case'

class DeleteStatusPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete record
    
    const id = request.params.id
    const deleteStatusPagamentoUseCase = container.resolve(DeleteStatusPagamentoUseCase)
    await deleteStatusPagamentoUseCase.execute(id)


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

export { DeleteStatusPagamentoController }
