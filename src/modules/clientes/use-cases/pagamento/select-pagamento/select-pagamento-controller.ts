import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { SelectPagamentoUseCase } from './select-pagamento-use-case'

class SelectPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filter } = request.query

    const selectPagamentoUseCase = container.resolve(SelectPagamentoUseCase)

    const pagamentos = await selectPagamentoUseCase.execute({
      filter: filter as string,
    })

    return response.json(pagamentos)
  }
}

export { SelectPagamentoController }
