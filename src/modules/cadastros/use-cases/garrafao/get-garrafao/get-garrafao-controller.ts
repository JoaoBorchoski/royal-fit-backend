import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetGarrafaoUseCase } from './get-garrafao-use-case'

class GetGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.params.id
    const getGarrafaoUseCase = container.resolve(GetGarrafaoUseCase)
    const garrafao = await getGarrafaoUseCase.execute(id)

    return response.status(garrafao.statusCode).json(garrafao.data)
  }
}

export { GetGarrafaoController }
