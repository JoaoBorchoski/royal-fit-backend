import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IdSelectEntradaGarrafaoUseCase } from './id-select-entrada-garrafao-use-case'

class IdSelectEntradaGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const idSelectEntradaGarrafaoUseCase = container.resolve(IdSelectEntradaGarrafaoUseCase)

    const entradaGarrafao = await idSelectEntradaGarrafaoUseCase.execute({
      id: id as string
    })

    return response.json(entradaGarrafao.data)
  }
}

export { IdSelectEntradaGarrafaoController }
