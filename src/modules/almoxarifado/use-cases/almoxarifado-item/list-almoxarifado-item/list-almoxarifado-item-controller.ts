import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListAlmoxarifadoItemUseCase } from './list-almoxarifado-item-use-case'

class ListAlmoxarifadoItemController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search,
      page,
      pageSize,
      order,
      filter
    } = request.body

    const listAlmoxarifadoItemUseCase = container.resolve(ListAlmoxarifadoItemUseCase)

    const almoxarifadoItens = await listAlmoxarifadoItemUseCase.execute({
      search: search as string,
      page: Number(page) as number,
      rowsPerPage: Number(pageSize) as number,
      order: order as string,
      filter: filter as string
    })

    return response.json(almoxarifadoItens)
  }
}

export { ListAlmoxarifadoItemController }
