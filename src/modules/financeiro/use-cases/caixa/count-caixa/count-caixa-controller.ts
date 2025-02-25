import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CountCaixaUseCase } from './count-caixa-use-case'

class CountCaixaController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search
    } = request.body

    const countCaixaUseCase = container.resolve(CountCaixaUseCase)

    const caixasCount = await countCaixaUseCase.execute({
      search: search as string
    })

    return response.status(caixasCount.statusCode).json(caixasCount)
  }
}

export { CountCaixaController }
