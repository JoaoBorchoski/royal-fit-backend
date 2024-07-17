import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IdSelectEstoqueUseCase } from './id-select-estoque-use-case'

class IdSelectEstoqueController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const idSelectEstoqueUseCase = container.resolve(IdSelectEstoqueUseCase)

    const estoque = await idSelectEstoqueUseCase.execute({
      id: id as string
    })

    return response.json(estoque.data)
  }
}

export { IdSelectEstoqueController }
