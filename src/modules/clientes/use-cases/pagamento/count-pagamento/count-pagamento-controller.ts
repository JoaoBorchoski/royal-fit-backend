import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CountPagamentoUseCase } from './count-pagamento-use-case'

class CountPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search
    } = request.body

    const countPagamentoUseCase = container.resolve(CountPagamentoUseCase)

    const pagamentosCount = await countPagamentoUseCase.execute({
      search: search as string
    })

    return response.status(pagamentosCount.statusCode).json(pagamentosCount)
  }
}

export { CountPagamentoController }
