import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CountGarrafaoUseCase } from './count-garrafao-use-case'

class CountGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search
    } = request.body

    const countGarrafaoUseCase = container.resolve(CountGarrafaoUseCase)

    const garrafoesCount = await countGarrafaoUseCase.execute({
      search: search as string
    })

    return response.status(garrafoesCount.statusCode).json(garrafoesCount)
  }
}

export { CountGarrafaoController }
