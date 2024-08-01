import { Request, Response } from "express"
import { container } from "tsyringe"
import { CreatePagamentoUseCase } from "./create-pagamento-use-case"
import { HttpResponse } from "@shared/helpers"

class CreatePagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { clienteId, valorPago, meioPagamentoId, desabilitado } = request.body

    const userId = request.user.id

    const createPagamentoUseCase = container.resolve(CreatePagamentoUseCase)

    const result = await createPagamentoUseCase
      .execute({
        clienteId,
        valorPago,
        meioPagamentoId,
        userId,
        desabilitado,
      })
      .then((pagamentoResult) => {
        return pagamentoResult
      })
      .catch((error) => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { CreatePagamentoController }
