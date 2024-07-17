import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CountEstoqueUseCase } from './count-estoque-use-case'

class CountEstoqueController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search
    } = request.body

    const countEstoqueUseCase = container.resolve(CountEstoqueUseCase)

    const estoquesCount = await countEstoqueUseCase.execute({
      search: search as string
    })

    return response.status(estoquesCount.statusCode).json(estoquesCount)
  }
}

export { CountEstoqueController }
