import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IdSelectStatusPagamentoUseCase } from './id-select-status-pagamento-use-case'

class IdSelectStatusPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const idSelectStatusPagamentoUseCase = container.resolve(IdSelectStatusPagamentoUseCase)

    const statusPagamento = await idSelectStatusPagamentoUseCase.execute({
      id: id as string
    })

    return response.json(statusPagamento.data)
  }
}

export { IdSelectStatusPagamentoController }
