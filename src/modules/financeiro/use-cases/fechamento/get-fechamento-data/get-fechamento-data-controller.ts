import { Request, Response } from "express"
import { container } from "tsyringe"
import { GetFechamentoDataUseCase } from "./get-fechamento-data-use-case"

class GetFechamentoDataController {
  async handle(request: Request, response: Response): Promise<Response> {
    const getFechamentoDataUseCase = container.resolve(GetFechamentoDataUseCase)
    const fechamento = await getFechamentoDataUseCase.execute()

    return response.status(fechamento.statusCode).json(fechamento.data)
  }
}

export { GetFechamentoDataController }
