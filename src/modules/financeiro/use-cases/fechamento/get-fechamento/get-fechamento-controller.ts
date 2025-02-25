import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetFechamentoUseCase } from './get-fechamento-use-case'

class GetFechamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.params.id
    const getFechamentoUseCase = container.resolve(GetFechamentoUseCase)
    const fechamento = await getFechamentoUseCase.execute(id)

    return response.status(fechamento.statusCode).json(fechamento.data)
  }
}

export { GetFechamentoController }
