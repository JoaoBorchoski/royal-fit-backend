import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListEstoqueUseCase } from './list-estoque-use-case'

class ListEstoqueController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search,
      page,
      pageSize,
      order,
      filter
    } = request.body

    const listEstoqueUseCase = container.resolve(ListEstoqueUseCase)

    const estoques = await listEstoqueUseCase.execute({
      search: search as string,
      page: Number(page) as number,
      rowsPerPage: Number(pageSize) as number,
      order: order as string,
      filter: filter as string
    })

    return response.json(estoques)
  }
}

export { ListEstoqueController }
