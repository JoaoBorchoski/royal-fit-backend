import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListBonificacaoUseCase } from './list-bonificacao-use-case'

class ListBonificacaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search,
      page,
      pageSize,
      order,
      filter
    } = request.body

    const listBonificacaoUseCase = container.resolve(ListBonificacaoUseCase)

    const bonificacoes = await listBonificacaoUseCase.execute({
      search: search as string,
      page: Number(page) as number,
      rowsPerPage: Number(pageSize) as number,
      order: order as string,
      filter: filter as string
    })

    return response.json(bonificacoes)
  }
}

export { ListBonificacaoController }
