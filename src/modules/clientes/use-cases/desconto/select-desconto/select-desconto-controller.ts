import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { SelectDescontoUseCase } from './select-desconto-use-case'

class SelectDescontoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filter } = request.query

    const selectDescontoUseCase = container.resolve(SelectDescontoUseCase)

    const descontos = await selectDescontoUseCase.execute({
      filter: filter as string,
    })

    return response.json(descontos)
  }
}

export { SelectDescontoController }
