import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CountBonificacaoUseCase } from './count-bonificacao-use-case'

class CountBonificacaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search
    } = request.body

    const countBonificacaoUseCase = container.resolve(CountBonificacaoUseCase)

    const bonificacoesCount = await countBonificacaoUseCase.execute({
      search: search as string
    })

    return response.status(bonificacoesCount.statusCode).json(bonificacoesCount)
  }
}

export { CountBonificacaoController }
