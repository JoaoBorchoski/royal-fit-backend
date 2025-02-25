import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListCaixaUseCase } from './list-caixa-use-case'

class ListCaixaController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search,
      page,
      pageSize,
      order,
      filter
    } = request.body

    const listCaixaUseCase = container.resolve(ListCaixaUseCase)

    const caixas = await listCaixaUseCase.execute({
      search: search as string,
      page: Number(page) as number,
      rowsPerPage: Number(pageSize) as number,
      order: order as string,
      filter: filter as string
    })

    return response.json(caixas)
  }
}

export { ListCaixaController }
