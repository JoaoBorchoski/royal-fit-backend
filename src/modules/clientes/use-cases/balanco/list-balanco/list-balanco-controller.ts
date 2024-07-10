import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListBalancoUseCase } from './list-balanco-use-case'

class ListBalancoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search,
      page,
      pageSize,
      order,
      filter
    } = request.body

    const listBalancoUseCase = container.resolve(ListBalancoUseCase)

    const balancos = await listBalancoUseCase.execute({
      search: search as string,
      page: Number(page) as number,
      rowsPerPage: Number(pageSize) as number,
      order: order as string,
      filter: filter as string
    })

    return response.json(balancos)
  }
}

export { ListBalancoController }
