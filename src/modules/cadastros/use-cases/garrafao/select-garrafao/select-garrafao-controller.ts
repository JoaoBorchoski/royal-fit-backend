import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { SelectGarrafaoUseCase } from './select-garrafao-use-case'

class SelectGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filter } = request.query

    const selectGarrafaoUseCase = container.resolve(SelectGarrafaoUseCase)

    const garrafoes = await selectGarrafaoUseCase.execute({
      filter: filter as string,
    })

    return response.json(garrafoes)
  }
}

export { SelectGarrafaoController }
