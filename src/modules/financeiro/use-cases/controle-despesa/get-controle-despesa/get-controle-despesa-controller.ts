import { Request, Response } from "express"
import { container } from "tsyringe"
import { GetControleDespesaUseCase } from "./get-controle-despesa-use-case"

class GetControleDespesaController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.params.id
    const getControleDespesaUseCase = container.resolve(GetControleDespesaUseCase)
    const controleDespesa = await getControleDespesaUseCase.execute(id)

    return response.status(controleDespesa.statusCode).json(controleDespesa.data)
  }
}

export { GetControleDespesaController }
