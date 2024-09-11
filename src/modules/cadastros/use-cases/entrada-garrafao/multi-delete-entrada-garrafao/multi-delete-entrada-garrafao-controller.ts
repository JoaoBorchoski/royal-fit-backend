import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { MultiDeleteEntradaGarrafaoUseCase } from './multi-delete-entrada-garrafao-use-case'
import { ListEntradaGarrafaoUseCase } from '../list-entrada-garrafao/list-entrada-garrafao-use-case'

class MultiDeleteEntradaGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete multi record

    const ids = request.body
    const multiDeleteEntradaGarrafaoUseCase = container.resolve(MultiDeleteEntradaGarrafaoUseCase)
    await multiDeleteEntradaGarrafaoUseCase.execute(ids)


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

export { MultiDeleteEntradaGarrafaoController }
