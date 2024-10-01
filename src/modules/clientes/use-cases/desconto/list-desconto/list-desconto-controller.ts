import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListDescontoUseCase } from './list-desconto-use-case'

class ListDescontoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search,
      page,
      pageSize,
      order,
      filter
    } = request.body

    const listDescontoUseCase = container.resolve(ListDescontoUseCase)

    const descontos = await listDescontoUseCase.execute({
      search: search as string,
      page: Number(page) as number,
      rowsPerPage: Number(pageSize) as number,
      order: order as string,
      filter: filter as string
    })

    return response.json(descontos)
  }
}

export { ListDescontoController }
