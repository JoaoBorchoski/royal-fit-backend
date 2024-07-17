import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetEstoqueUseCase } from './get-estoque-use-case'

class GetEstoqueController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.params.id
    const getEstoqueUseCase = container.resolve(GetEstoqueUseCase)
    const estoque = await getEstoqueUseCase.execute(id)

    return response.status(estoque.statusCode).json(estoque.data)
  }
}

export { GetEstoqueController }
