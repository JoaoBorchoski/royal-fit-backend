import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { SelectCaixaUseCase } from './select-caixa-use-case'

class SelectCaixaController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filter } = request.query

    const selectCaixaUseCase = container.resolve(SelectCaixaUseCase)

    const caixas = await selectCaixaUseCase.execute({
      filter: filter as string,
    })

    return response.json(caixas)
  }
}

export { SelectCaixaController }
