import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { MultiDeleteEstoqueUseCase } from './multi-delete-estoque-use-case'
import { ListEstoqueUseCase } from '../list-estoque/list-estoque-use-case'

class MultiDeleteEstoqueController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete multi record

    const ids = request.body
    const multiDeleteEstoqueUseCase = container.resolve(MultiDeleteEstoqueUseCase)
    await multiDeleteEstoqueUseCase.execute(ids)


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

export { MultiDeleteEstoqueController }
