import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { DeleteFechamentoUseCase } from './delete-fechamento-use-case'
import { ListFechamentoUseCase } from '../list-fechamento/list-fechamento-use-case'

class DeleteFechamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete record
    
    const id = request.params.id
    const deleteFechamentoUseCase = container.resolve(DeleteFechamentoUseCase)
    await deleteFechamentoUseCase.execute(id)


    // restore list with updated records

    const listFechamentoUseCase = container.resolve(ListFechamentoUseCase)
    const fechamentos = await listFechamentoUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(fechamentos)
  }
}

export { DeleteFechamentoController }
