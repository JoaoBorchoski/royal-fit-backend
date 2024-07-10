import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { SelectBalancoUseCase } from './select-balanco-use-case'

class SelectBalancoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filter } = request.query

    const selectBalancoUseCase = container.resolve(SelectBalancoUseCase)

    const balancos = await selectBalancoUseCase.execute({
      filter: filter as string,
    })

    return response.json(balancos)
  }
}

export { SelectBalancoController }
