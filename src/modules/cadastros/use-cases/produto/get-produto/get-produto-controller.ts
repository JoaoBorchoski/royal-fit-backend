import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetProdutoUseCase } from './get-produto-use-case'

class GetProdutoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.params.id
    const getProdutoUseCase = container.resolve(GetProdutoUseCase)
    const produto = await getProdutoUseCase.execute(id)

    return response.status(produto.statusCode).json(produto.data)
  }
}

export { GetProdutoController }
