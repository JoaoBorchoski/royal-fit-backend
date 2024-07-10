import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { DeleteGarrafaoUseCase } from './delete-garrafao-use-case'
import { ListGarrafaoUseCase } from '../list-garrafao/list-garrafao-use-case'

class DeleteGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete record
    
    const id = request.params.id
    const deleteGarrafaoUseCase = container.resolve(DeleteGarrafaoUseCase)
    await deleteGarrafaoUseCase.execute(id)


    // restore list with updated records

    const listGarrafaoUseCase = container.resolve(ListGarrafaoUseCase)
    const garrafoes = await listGarrafaoUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(garrafoes)
  }
}

export { DeleteGarrafaoController }
