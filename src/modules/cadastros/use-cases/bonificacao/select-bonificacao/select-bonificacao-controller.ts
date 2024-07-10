import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { SelectBonificacaoUseCase } from './select-bonificacao-use-case'

class SelectBonificacaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filter } = request.query

    const selectBonificacaoUseCase = container.resolve(SelectBonificacaoUseCase)

    const bonificacoes = await selectBonificacaoUseCase.execute({
      filter: filter as string,
    })

    return response.json(bonificacoes)
  }
}

export { SelectBonificacaoController }
