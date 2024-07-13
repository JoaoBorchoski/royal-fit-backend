import { Request, Response } from "express"
import { container } from "tsyringe"
import { CreatePedidoUseCase } from "./create-pedido-use-case"
import { HttpResponse } from "@shared/helpers"

class CreatePedidoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      sequencial,
      clienteId,
      data,
      hora,
      valorTotal,
      desconto,
      funcionarioId,
      meioPagamentoId,
      statusPagamentoId,
      isPagamentoPosterior,
      desabilitado,
      pedidoItemForm,
    } = request.body

    const createPedidoUseCase = container.resolve(CreatePedidoUseCase)

    const result = await createPedidoUseCase
      .execute({
        sequencial,
        clienteId,
        data,
        hora,
        valorTotal,
        desconto,
        funcionarioId,
        meioPagamentoId,
        statusPagamentoId,
        isPagamentoPosterior,
        desabilitado,
        pedidoItemForm,
      })
      .then((pedidoResult) => {
        return pedidoResult
      })
      .catch((error) => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { CreatePedidoController }
