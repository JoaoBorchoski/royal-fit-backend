import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IdSelectMeioPagamentoUseCase } from './id-select-meio-pagamento-use-case'

class IdSelectMeioPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const idSelectMeioPagamentoUseCase = container.resolve(IdSelectMeioPagamentoUseCase)

    const meioPagamento = await idSelectMeioPagamentoUseCase.execute({
      id: id as string
    })

    return response.json(meioPagamento.data)
  }
}

export { IdSelectMeioPagamentoController }
