import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { DeleteAlmoxarifadoItemUseCase } from './delete-almoxarifado-item-use-case'
import { ListAlmoxarifadoItemUseCase } from '../list-almoxarifado-item/list-almoxarifado-item-use-case'

class DeleteAlmoxarifadoItemController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete record
    
    const id = request.params.id
    const deleteAlmoxarifadoItemUseCase = container.resolve(DeleteAlmoxarifadoItemUseCase)
    await deleteAlmoxarifadoItemUseCase.execute(id)


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

export { DeleteAlmoxarifadoItemController }
