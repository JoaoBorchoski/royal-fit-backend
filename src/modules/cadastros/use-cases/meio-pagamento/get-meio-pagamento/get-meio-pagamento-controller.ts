import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetMeioPagamentoUseCase } from './get-meio-pagamento-use-case'

class GetMeioPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.params.id
    const getMeioPagamentoUseCase = container.resolve(GetMeioPagamentoUseCase)
    const meioPagamento = await getMeioPagamentoUseCase.execute(id)

    return response.status(meioPagamento.statusCode).json(meioPagamento.data)
  }
}

export { GetMeioPagamentoController }
