import { Request, Response } from "express"
import { container } from "tsyringe"
import { CreateEstoqueUseCase } from "./create-estoque-use-case"
import { HttpResponse } from "@shared/helpers"

class CreateEstoqueController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { produtoId, quantidade, desabilitado } = request.body

    const createEstoqueUseCase = container.resolve(CreateEstoqueUseCase)

    const result = await createEstoqueUseCase
      .execute({
        produtoId,
        quantidade,
        desabilitado,
      })
      .then((estoqueResult) => {
        return estoqueResult
      })
      .catch((error) => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { CreateEstoqueController }
