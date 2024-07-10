import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IdSelectBonificacaoUseCase } from './id-select-bonificacao-use-case'

class IdSelectBonificacaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const idSelectBonificacaoUseCase = container.resolve(IdSelectBonificacaoUseCase)

    const bonificacao = await idSelectBonificacaoUseCase.execute({
      id: id as string
    })

    return response.json(bonificacao.data)
  }
}

export { IdSelectBonificacaoController }
