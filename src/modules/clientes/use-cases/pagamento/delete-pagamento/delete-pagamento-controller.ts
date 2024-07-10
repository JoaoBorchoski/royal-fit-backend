import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { DeletePagamentoUseCase } from './delete-pagamento-use-case'
import { ListPagamentoUseCase } from '../list-pagamento/list-pagamento-use-case'

class DeletePagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete record
    
    const id = request.params.id
    const deletePagamentoUseCase = container.resolve(DeletePagamentoUseCase)
    await deletePagamentoUseCase.execute(id)


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

export { DeletePagamentoController }
