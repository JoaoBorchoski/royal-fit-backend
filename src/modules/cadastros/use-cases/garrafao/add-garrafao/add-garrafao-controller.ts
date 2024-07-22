import { Request, Response } from "express"
import { container } from "tsyringe"
import { AddGarrafaoUseCase } from "./add-garrafao-use-case"

class AddGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { clienteId, quantidade } = request.body

    const { id } = request.params

    const addGarrafaoUseCase = container.resolve(AddGarrafaoUseCase)

    const result = await addGarrafaoUseCase
      .execute({
        id,
        clienteId,
        quantidade,
      })
      .then((garrafaoResult) => {
        return garrafaoResult
      })
      .catch((error) => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { AddGarrafaoController }
