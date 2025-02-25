import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IdSelectFechamentoUseCase } from './id-select-fechamento-use-case'

class IdSelectFechamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const idSelectFechamentoUseCase = container.resolve(IdSelectFechamentoUseCase)

    const fechamento = await idSelectFechamentoUseCase.execute({
      id: id as string
    })

    return response.json(fechamento.data)
  }
}

export { IdSelectFechamentoController }
