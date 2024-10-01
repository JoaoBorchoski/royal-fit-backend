import { Request, Response } from "express"
import { container } from "tsyringe"
import { SelectProdutoWithoutDesabilitadoUseCase } from "./select-produto-without-desabilitado-use-case"

class SelectProdutoWithoutDesabilitadoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filter } = request.query

    const selectProdutoWithoutDesabilitadoUseCase = container.resolve(SelectProdutoWithoutDesabilitadoUseCase)

    const produtos = await selectProdutoWithoutDesabilitadoUseCase.execute({
      filter: filter as string,
    })

    return response.json(produtos)
  }
}

export { SelectProdutoWithoutDesabilitadoController }
