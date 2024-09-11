import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CountEntradaGarrafaoUseCase } from './count-entrada-garrafao-use-case'

class CountEntradaGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search
    } = request.body

    const countEntradaGarrafaoUseCase = container.resolve(CountEntradaGarrafaoUseCase)

    const entradasGarrafaoCount = await countEntradaGarrafaoUseCase.execute({
      search: search as string
    })

    return response.status(entradasGarrafaoCount.statusCode).json(entradasGarrafaoCount)
  }
}

export { CountEntradaGarrafaoController }
