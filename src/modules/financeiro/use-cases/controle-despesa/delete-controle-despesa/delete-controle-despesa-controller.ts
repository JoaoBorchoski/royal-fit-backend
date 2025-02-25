import { Request, Response } from "express"
import { container } from "tsyringe"
import { DeleteControleDespesaUseCase } from "./delete-controle-despesa-use-case"

class DeleteControleDespesaController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete record

    const id = request.params.id
    const deleteControleDespesaUseCase = container.resolve(DeleteControleDespesaUseCase)
    await deleteControleDespesaUseCase.execute(id)

    // restore list with updated records

    const listControleDespesaUseCase = container.resolve(DeleteControleDespesaUseCase)
    const controleDespesas = await listControleDespesaUseCase.execute(id)

    return response.json(controleDespesas)
  }
}

export { DeleteControleDespesaController }
