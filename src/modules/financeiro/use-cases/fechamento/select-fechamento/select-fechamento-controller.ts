import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { SelectFechamentoUseCase } from './select-fechamento-use-case'

class SelectFechamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filter } = request.query

    const selectFechamentoUseCase = container.resolve(SelectFechamentoUseCase)

    const fechamentos = await selectFechamentoUseCase.execute({
      filter: filter as string,
    })

    return response.json(fechamentos)
  }
}

export { SelectFechamentoController }
