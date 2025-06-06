import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListGarrafaoUseCase } from './list-garrafao-use-case'

class ListGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search,
      page,
      pageSize,
      order,
      filter
    } = request.body

    const listGarrafaoUseCase = container.resolve(ListGarrafaoUseCase)

    const garrafoes = await listGarrafaoUseCase.execute({
      search: search as string,
      page: Number(page) as number,
      rowsPerPage: Number(pageSize) as number,
      order: order as string,
      filter: filter as string
    })

    return response.json(garrafoes)
  }
}

export { ListGarrafaoController }
