import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { MultiDeleteAlmoxarifadoItemUseCase } from './multi-delete-almoxarifado-item-use-case'
import { ListAlmoxarifadoItemUseCase } from '../list-almoxarifado-item/list-almoxarifado-item-use-case'

class MultiDeleteAlmoxarifadoItemController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete multi record

    const ids = request.body
    const multiDeleteAlmoxarifadoItemUseCase = container.resolve(MultiDeleteAlmoxarifadoItemUseCase)
    await multiDeleteAlmoxarifadoItemUseCase.execute(ids)


    // restore list with updated records

    const listAlmoxarifadoItemUseCase = container.resolve(ListAlmoxarifadoItemUseCase)
    const almoxarifadoItens = await listAlmoxarifadoItemUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(almoxarifadoItens)
  }
}

export { MultiDeleteAlmoxarifadoItemController }
