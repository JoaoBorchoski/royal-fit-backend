import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { DeleteDescontoUseCase } from './delete-desconto-use-case'
import { ListDescontoUseCase } from '../list-desconto/list-desconto-use-case'

class DeleteDescontoController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete record
    
    const id = request.params.id
    const deleteDescontoUseCase = container.resolve(DeleteDescontoUseCase)
    await deleteDescontoUseCase.execute(id)


    // restore list with updated records

    const listDescontoUseCase = container.resolve(ListDescontoUseCase)
    const descontos = await listDescontoUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(descontos)
  }
}

export { DeleteDescontoController }
