import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IdSelectProdutoUseCase } from './id-select-produto-use-case'

class IdSelectProdutoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const idSelectProdutoUseCase = container.resolve(IdSelectProdutoUseCase)

    const produto = await idSelectProdutoUseCase.execute({
      id: id as string
    })

    return response.json(produto.data)
  }
}

export { IdSelectProdutoController }
