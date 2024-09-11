import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListEntradaGarrafaoUseCase } from './list-entrada-garrafao-use-case'

class ListEntradaGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search,
      page,
      pageSize,
      order,
      filter
    } = request.body

    const listEntradaGarrafaoUseCase = container.resolve(ListEntradaGarrafaoUseCase)

    const entradasGarrafao = await listEntradaGarrafaoUseCase.execute({
      search: search as string,
      page: Number(page) as number,
      rowsPerPage: Number(pageSize) as number,
      order: order as string,
      filter: filter as string
    })

    return response.json(entradasGarrafao)
  }
}

export { ListEntradaGarrafaoController }
