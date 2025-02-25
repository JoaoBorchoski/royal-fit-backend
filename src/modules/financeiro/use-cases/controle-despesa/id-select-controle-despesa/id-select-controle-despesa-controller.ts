import { Request, Response } from "express"
import { container } from "tsyringe"
import { IdSelectControleDespesaUseCase } from "./id-select-controle-despesa-use-case"

class IdSelectControleDespesaController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const idSelectControleDespesaUseCase = container.resolve(IdSelectControleDespesaUseCase)

    const controleDespesa = await idSelectControleDespesaUseCase.execute({
      id: id as string,
    })

    return response.json(controleDespesa.data)
  }
}

export { IdSelectControleDespesaController }
