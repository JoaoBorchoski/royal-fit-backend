import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { SelectEstoqueUseCase } from './select-estoque-use-case'

class SelectEstoqueController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filter } = request.query

    const selectEstoqueUseCase = container.resolve(SelectEstoqueUseCase)

    const estoques = await selectEstoqueUseCase.execute({
      filter: filter as string,
    })

    return response.json(estoques)
  }
}

export { SelectEstoqueController }
