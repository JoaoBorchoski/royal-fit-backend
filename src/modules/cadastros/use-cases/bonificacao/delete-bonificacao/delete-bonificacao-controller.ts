import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { DeleteBonificacaoUseCase } from './delete-bonificacao-use-case'
import { ListBonificacaoUseCase } from '../list-bonificacao/list-bonificacao-use-case'

class DeleteBonificacaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete record
    
    const id = request.params.id
    const deleteBonificacaoUseCase = container.resolve(DeleteBonificacaoUseCase)
    await deleteBonificacaoUseCase.execute(id)


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

export { DeleteBonificacaoController }
