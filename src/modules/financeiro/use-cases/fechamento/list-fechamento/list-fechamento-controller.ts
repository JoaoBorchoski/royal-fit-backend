import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListFechamentoUseCase } from './list-fechamento-use-case'

class ListFechamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search,
      page,
      pageSize,
      order,
      filter
    } = request.body

    const listFechamentoUseCase = container.resolve(ListFechamentoUseCase)

    const fechamentos = await listFechamentoUseCase.execute({
      search: search as string,
      page: Number(page) as number,
      rowsPerPage: Number(pageSize) as number,
      order: order as string,
      filter: filter as string
    })

    return response.json(fechamentos)
  }
}

export { ListFechamentoController }
