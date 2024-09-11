import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetEntradaGarrafaoUseCase } from './get-entrada-garrafao-use-case'

class GetEntradaGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.params.id
    const getEntradaGarrafaoUseCase = container.resolve(GetEntradaGarrafaoUseCase)
    const entradaGarrafao = await getEntradaGarrafaoUseCase.execute(id)

    return response.status(entradaGarrafao.statusCode).json(entradaGarrafao.data)
  }
}

export { GetEntradaGarrafaoController }
