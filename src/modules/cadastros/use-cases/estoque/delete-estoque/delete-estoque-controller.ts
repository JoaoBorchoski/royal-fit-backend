import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { DeleteEstoqueUseCase } from './delete-estoque-use-case'
import { ListEstoqueUseCase } from '../list-estoque/list-estoque-use-case'

class DeleteEstoqueController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete record
    
    const id = request.params.id
    const deleteEstoqueUseCase = container.resolve(DeleteEstoqueUseCase)
    await deleteEstoqueUseCase.execute(id)


    // restore list with updated records

    const listEstoqueUseCase = container.resolve(ListEstoqueUseCase)
    const estoques = await listEstoqueUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(estoques)
  }
}

export { DeleteEstoqueController }
