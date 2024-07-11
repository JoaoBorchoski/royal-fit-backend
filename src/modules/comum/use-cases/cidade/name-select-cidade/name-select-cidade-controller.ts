import { Request, Response } from "express"
import { container } from "tsyringe"
import { NameSelectCidadeUseCase } from "./name-select-cidade-use-case"

class NameSelectCidadeController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name } = request.query

    const nameSelectCidadeUseCase = container.resolve(NameSelectCidadeUseCase)

    const cidade = await nameSelectCidadeUseCase.execute({
      name: name as string,
    })

    return response.json(cidade.data)
  }
}

export { NameSelectCidadeController }
