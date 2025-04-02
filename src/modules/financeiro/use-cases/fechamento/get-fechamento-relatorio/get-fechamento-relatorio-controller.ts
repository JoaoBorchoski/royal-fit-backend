import { Request, Response } from "express"
import { container } from "tsyringe"
import { GetFechamentoRelatorioUseCase } from "./get-fechamento-relatorio-use-case"

class GetFechamentoRelatorioController {
  async handle(request: Request, response: Response): Promise<Response> {
    const getFechamentoRelatorioUseCase = container.resolve(GetFechamentoRelatorioUseCase)

    const { type, payload } = request.body

    const fechamento = await getFechamentoRelatorioUseCase.execute(type, payload)

    return response.status(fechamento.statusCode).json(fechamento.data)
  }
}

export { GetFechamentoRelatorioController }
