import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { DeleteCaixaUseCase } from './delete-caixa-use-case'
import { ListCaixaUseCase } from '../list-caixa/list-caixa-use-case'

class DeleteCaixaController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete record
    
    const id = request.params.id
    const deleteCaixaUseCase = container.resolve(DeleteCaixaUseCase)
    await deleteCaixaUseCase.execute(id)


    // restore list with updated records

    const listCaixaUseCase = container.resolve(ListCaixaUseCase)
    const caixas = await listCaixaUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(caixas)
  }
}

export { DeleteCaixaController }
