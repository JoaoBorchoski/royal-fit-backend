import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetDescontoUseCase } from './get-desconto-use-case'

class GetDescontoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.params.id
    const getDescontoUseCase = container.resolve(GetDescontoUseCase)
    const desconto = await getDescontoUseCase.execute(id)

    return response.status(desconto.statusCode).json(desconto.data)
  }
}

export { GetDescontoController }
