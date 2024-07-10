import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IdSelectGarrafaoUseCase } from './id-select-garrafao-use-case'

class IdSelectGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const idSelectGarrafaoUseCase = container.resolve(IdSelectGarrafaoUseCase)

    const garrafao = await idSelectGarrafaoUseCase.execute({
      id: id as string
    })

    return response.json(garrafao.data)
  }
}

export { IdSelectGarrafaoController }
