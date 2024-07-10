import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetStatusPagamentoUseCase } from './get-status-pagamento-use-case'

class GetStatusPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.params.id
    const getStatusPagamentoUseCase = container.resolve(GetStatusPagamentoUseCase)
    const statusPagamento = await getStatusPagamentoUseCase.execute(id)

    return response.status(statusPagamento.statusCode).json(statusPagamento.data)
  }
}

export { GetStatusPagamentoController }
