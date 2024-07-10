import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IdSelectPagamentoUseCase } from './id-select-pagamento-use-case'

class IdSelectPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const idSelectPagamentoUseCase = container.resolve(IdSelectPagamentoUseCase)

    const pagamento = await idSelectPagamentoUseCase.execute({
      id: id as string
    })

    return response.json(pagamento.data)
  }
}

export { IdSelectPagamentoController }
