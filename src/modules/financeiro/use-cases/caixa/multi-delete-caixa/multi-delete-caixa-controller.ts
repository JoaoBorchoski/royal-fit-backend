import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { MultiDeleteCaixaUseCase } from './multi-delete-caixa-use-case'
import { ListCaixaUseCase } from '../list-caixa/list-caixa-use-case'

class MultiDeleteCaixaController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete multi record

    const ids = request.body
    const multiDeleteCaixaUseCase = container.resolve(MultiDeleteCaixaUseCase)
    await multiDeleteCaixaUseCase.execute(ids)


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

export { MultiDeleteCaixaController }
