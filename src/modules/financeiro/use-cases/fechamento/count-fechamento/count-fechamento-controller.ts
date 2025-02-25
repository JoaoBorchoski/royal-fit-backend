import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CountFechamentoUseCase } from './count-fechamento-use-case'

class CountFechamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search
    } = request.body

    const countFechamentoUseCase = container.resolve(CountFechamentoUseCase)

    const fechamentosCount = await countFechamentoUseCase.execute({
      search: search as string
    })

    return response.status(fechamentosCount.statusCode).json(fechamentosCount)
  }
}

export { CountFechamentoController }
