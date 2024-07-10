import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { SelectStatusPagamentoUseCase } from './select-status-pagamento-use-case'

class SelectStatusPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filter } = request.query

    const selectStatusPagamentoUseCase = container.resolve(SelectStatusPagamentoUseCase)

    const statusPagamento = await selectStatusPagamentoUseCase.execute({
      filter: filter as string,
    })

    return response.json(statusPagamento)
  }
}

export { SelectStatusPagamentoController }
