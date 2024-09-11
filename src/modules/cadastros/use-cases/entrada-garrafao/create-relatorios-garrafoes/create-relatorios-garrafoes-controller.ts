import { Request, Response } from "express"
import { container } from "tsyringe"
import { CreateRelatorioGarrafaoUseCase } from "./create-relatorios-garrafoes-use-case"
import { HttpResponse } from "@shared/helpers"

class CreateRelatorioGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { dataInicio, dataFim } = request.body
    const clienteId = request.params.id

    const createEntradaGarrafaoUseCase = container.resolve(CreateRelatorioGarrafaoUseCase)

    const result = await createEntradaGarrafaoUseCase
      .execute({
        clienteId,
        dataInicio,
        dataFim,
      })
      .then((entradaGarrafaoResult) => {
        return entradaGarrafaoResult
      })
      .catch((error) => {
        return error
      })

    return response.status(result.statusCode).json(result.data)
  }
}

export { CreateRelatorioGarrafaoController }
