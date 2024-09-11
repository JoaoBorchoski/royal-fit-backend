import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { DeleteEntradaGarrafaoUseCase } from './delete-entrada-garrafao-use-case'
import { ListEntradaGarrafaoUseCase } from '../list-entrada-garrafao/list-entrada-garrafao-use-case'

class DeleteEntradaGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete record
    
    const id = request.params.id
    const deleteEntradaGarrafaoUseCase = container.resolve(DeleteEntradaGarrafaoUseCase)
    await deleteEntradaGarrafaoUseCase.execute(id)


    // restore list with updated records

    const listEntradaGarrafaoUseCase = container.resolve(ListEntradaGarrafaoUseCase)
    const entradasGarrafao = await listEntradaGarrafaoUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(entradasGarrafao)
  }
}

export { DeleteEntradaGarrafaoController }
