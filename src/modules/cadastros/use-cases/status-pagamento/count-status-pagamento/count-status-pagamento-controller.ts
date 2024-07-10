import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CountStatusPagamentoUseCase } from './count-status-pagamento-use-case'

class CountStatusPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search
    } = request.body

    const countStatusPagamentoUseCase = container.resolve(CountStatusPagamentoUseCase)

    const statusPagamentoCount = await countStatusPagamentoUseCase.execute({
      search: search as string
    })

    return response.status(statusPagamentoCount.statusCode).json(statusPagamentoCount)
  }
}

export { CountStatusPagamentoController }
