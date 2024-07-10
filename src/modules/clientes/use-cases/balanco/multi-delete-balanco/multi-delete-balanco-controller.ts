import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { MultiDeleteBalancoUseCase } from './multi-delete-balanco-use-case'
import { ListBalancoUseCase } from '../list-balanco/list-balanco-use-case'

class MultiDeleteBalancoController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete multi record

    const ids = request.body
    const multiDeleteBalancoUseCase = container.resolve(MultiDeleteBalancoUseCase)
    await multiDeleteBalancoUseCase.execute(ids)


    // restore list with updated records

    const listBalancoUseCase = container.resolve(ListBalancoUseCase)
    const balancos = await listBalancoUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(balancos)
  }
}

export { MultiDeleteBalancoController }
