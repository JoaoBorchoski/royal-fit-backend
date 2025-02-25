import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { MultiDeleteFechamentoUseCase } from './multi-delete-fechamento-use-case'
import { ListFechamentoUseCase } from '../list-fechamento/list-fechamento-use-case'

class MultiDeleteFechamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete multi record

    const ids = request.body
    const multiDeleteFechamentoUseCase = container.resolve(MultiDeleteFechamentoUseCase)
    await multiDeleteFechamentoUseCase.execute(ids)


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

export { MultiDeleteFechamentoController }
