import { Request, Response } from "express"
import { container } from "tsyringe"
import { SelectControleDespesaUseCase } from "./select-controle-despesa-use-case"

class SelectControleDespesaController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filter } = request.query

    const selectControleDespesaUseCase = container.resolve(SelectControleDespesaUseCase)

    const controleDespesas = await selectControleDespesaUseCase.execute({
      filter: filter as string,
    })

    return response.json(controleDespesas)
  }
}

export { SelectControleDespesaController }
