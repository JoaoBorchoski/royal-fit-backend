import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { DeleteBalancoUseCase } from './delete-balanco-use-case'
import { ListBalancoUseCase } from '../list-balanco/list-balanco-use-case'

class DeleteBalancoController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete record
    
    const id = request.params.id
    const deleteBalancoUseCase = container.resolve(DeleteBalancoUseCase)
    await deleteBalancoUseCase.execute(id)


    // restore list with updated records

    const listBalancoUseCase = container.resolve(ListBalancoUseCase)
    const balancos = await listBalancoUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(balancos)
  }
}

export { DeleteBalancoController }
