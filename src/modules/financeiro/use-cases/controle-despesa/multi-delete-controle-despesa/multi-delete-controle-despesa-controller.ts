import { Request, Response } from "express"
import { container } from "tsyringe"
import { MultiDeleteControleDespesaUseCase } from "./multi-delete-controle-despesa-use-case"
import { ListControleDespesaUseCase } from "../list-controle-despesa/list-controle-despesa-use-case"

class MultiDeleteControleDespesaController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete multi record

    const ids = request.body
    const multiDeleteControleDespesaUseCase = container.resolve(MultiDeleteControleDespesaUseCase)
    await multiDeleteControleDespesaUseCase.execute(ids)

    // restore list with updated records

    const listControleDespesaUseCase = container.resolve(ListControleDespesaUseCase)
    const controleDespesas = await listControleDespesaUseCase.execute({
      search: "",
      page: 0,
      rowsPerPage: 100,
      order: "",
    })

    return response.json(controleDespesas)
  }
}

export { MultiDeleteControleDespesaController }
