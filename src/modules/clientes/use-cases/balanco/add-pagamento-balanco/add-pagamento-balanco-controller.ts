import { Request, Response } from "express"
import { container } from "tsyringe"
import { AddPagamentoBalancoUseCase } from "./add-pagamento-balanco-use-case"

class AddPagamentoBalancoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { clienteId, valor, meioPagamentoId, data } = request.body

    const { id } = request.params

    const addPagamentoBalancoUseCase = container.resolve(AddPagamentoBalancoUseCase)

    const result = await addPagamentoBalancoUseCase
      .execute({
        id,
        clienteId,
        valor,
        data,
        meioPagamentoId,
        userId: request.user.id,
      })
      .then((balancoResult) => {
        return balancoResult
      })
      .catch((error) => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { AddPagamentoBalancoController }
