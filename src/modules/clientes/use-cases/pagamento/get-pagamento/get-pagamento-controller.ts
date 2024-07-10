import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetPagamentoUseCase } from './get-pagamento-use-case'

class GetPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.params.id
    const getPagamentoUseCase = container.resolve(GetPagamentoUseCase)
    const pagamento = await getPagamentoUseCase.execute(id)

    return response.status(pagamento.statusCode).json(pagamento.data)
  }
}

export { GetPagamentoController }
