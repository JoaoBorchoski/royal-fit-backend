import { Request, Response } from "express"
import { container } from "tsyringe"
import { ListControleDespesaUseCase } from "./list-controle-despesa-use-case"

class ListControleDespesaController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { search, page, pageSize, order, filter } = request.body

    const listControleDespesaUseCase = container.resolve(ListControleDespesaUseCase)

    const controleDespesas = await listControleDespesaUseCase.execute({
      search: search as string,
      page: Number(page) as number,
      rowsPerPage: Number(pageSize) as number,
      order: order as string,
      filter: filter as string,
    })

    return response.json(controleDespesas)
  }
}

export { ListControleDespesaController }
