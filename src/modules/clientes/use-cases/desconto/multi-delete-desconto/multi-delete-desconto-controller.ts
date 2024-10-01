import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { MultiDeleteDescontoUseCase } from './multi-delete-desconto-use-case'
import { ListDescontoUseCase } from '../list-desconto/list-desconto-use-case'

class MultiDeleteDescontoController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete multi record

    const ids = request.body
    const multiDeleteDescontoUseCase = container.resolve(MultiDeleteDescontoUseCase)
    await multiDeleteDescontoUseCase.execute(ids)


    // restore list with updated records

    const listDescontoUseCase = container.resolve(ListDescontoUseCase)
    const descontos = await listDescontoUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(descontos)
  }
}

export { MultiDeleteDescontoController }
