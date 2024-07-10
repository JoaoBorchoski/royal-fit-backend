import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CountMeioPagamentoUseCase } from './count-meio-pagamento-use-case'

class CountMeioPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search
    } = request.body

    const countMeioPagamentoUseCase = container.resolve(CountMeioPagamentoUseCase)

    const meiosPagamentoCount = await countMeioPagamentoUseCase.execute({
      search: search as string
    })

    return response.status(meiosPagamentoCount.statusCode).json(meiosPagamentoCount)
  }
}

export { CountMeioPagamentoController }
