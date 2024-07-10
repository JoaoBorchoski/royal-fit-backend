import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CountProdutoUseCase } from './count-produto-use-case'

class CountProdutoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search
    } = request.body

    const countProdutoUseCase = container.resolve(CountProdutoUseCase)

    const produtosCount = await countProdutoUseCase.execute({
      search: search as string
    })

    return response.status(produtosCount.statusCode).json(produtosCount)
  }
}

export { CountProdutoController }
