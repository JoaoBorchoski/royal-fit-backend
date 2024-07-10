import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { MultiDeleteGarrafaoUseCase } from './multi-delete-garrafao-use-case'
import { ListGarrafaoUseCase } from '../list-garrafao/list-garrafao-use-case'

class MultiDeleteGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete multi record

    const ids = request.body
    const multiDeleteGarrafaoUseCase = container.resolve(MultiDeleteGarrafaoUseCase)
    await multiDeleteGarrafaoUseCase.execute(ids)


    // restore list with updated records

    const listGarrafaoUseCase = container.resolve(ListGarrafaoUseCase)
    const garrafoes = await listGarrafaoUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(garrafoes)
  }
}

export { MultiDeleteGarrafaoController }
