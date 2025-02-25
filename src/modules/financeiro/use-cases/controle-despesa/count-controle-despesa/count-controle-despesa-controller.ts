import { Request, Response } from "express"
import { container } from "tsyringe"
import { CountControleDespesaUseCase } from "./count-controle-despesa-use-case"

class CountControleDespesaController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { search } = request.body

    const countControleDespesaUseCase = container.resolve(CountControleDespesaUseCase)

    const controleDespesasCount = await countControleDespesaUseCase.execute({
      search: search as string,
    })

    return response.status(controleDespesasCount.statusCode).json(controleDespesasCount)
  }
}

export { CountControleDespesaController }
