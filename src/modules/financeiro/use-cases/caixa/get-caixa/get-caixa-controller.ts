import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetCaixaUseCase } from './get-caixa-use-case'

class GetCaixaController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.params.id
    const getCaixaUseCase = container.resolve(GetCaixaUseCase)
    const caixa = await getCaixaUseCase.execute(id)

    return response.status(caixa.statusCode).json(caixa.data)
  }
}

export { GetCaixaController }
