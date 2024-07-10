import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { MultiDeleteBonificacaoUseCase } from './multi-delete-bonificacao-use-case'
import { ListBonificacaoUseCase } from '../list-bonificacao/list-bonificacao-use-case'

class MultiDeleteBonificacaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete multi record

    const ids = request.body
    const multiDeleteBonificacaoUseCase = container.resolve(MultiDeleteBonificacaoUseCase)
    await multiDeleteBonificacaoUseCase.execute(ids)


    // restore list with updated records

    const listBonificacaoUseCase = container.resolve(ListBonificacaoUseCase)
    const bonificacoes = await listBonificacaoUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(bonificacoes)
  }
}

export { MultiDeleteBonificacaoController }
