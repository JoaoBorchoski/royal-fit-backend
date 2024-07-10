import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetBonificacaoUseCase } from './get-bonificacao-use-case'

class GetBonificacaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.params.id
    const getBonificacaoUseCase = container.resolve(GetBonificacaoUseCase)
    const bonificacao = await getBonificacaoUseCase.execute(id)

    return response.status(bonificacao.statusCode).json(bonificacao.data)
  }
}

export { GetBonificacaoController }
