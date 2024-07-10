import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { DeleteProdutoUseCase } from './delete-produto-use-case'
import { ListProdutoUseCase } from '../list-produto/list-produto-use-case'

class DeleteProdutoController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete record
    
    const id = request.params.id
    const deleteProdutoUseCase = container.resolve(DeleteProdutoUseCase)
    await deleteProdutoUseCase.execute(id)


    // restore list with updated records

    const listProdutoUseCase = container.resolve(ListProdutoUseCase)
    const produtos = await listProdutoUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(produtos)
  }
}

export { DeleteProdutoController }
