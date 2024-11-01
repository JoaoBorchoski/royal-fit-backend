import { Request, Response } from "express"
import { container } from "tsyringe"
import { CreatePedidoUseCase } from "./create-pedido-use-case"
import { HttpResponse } from "@shared/helpers"
// import { io } from "@shared/infra/http/server"

class CreatePedidoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      sequencial,
      clienteId,
      data,
      hora,
      valorTotal,
      desconto,
      descricao,
      funcionarioId,
      meioPagamentoId,
      statusPagamentoId,
      isPagamentoPosterior,
      isLiberado,
      desabilitado,
      impressoraIp,
      pedidoItemForm,
      tipoEntrega,
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
        descricao,
        funcionarioId,
        meioPagamentoId,
        statusPagamentoId,
        isPagamentoPosterior,
        isLiberado,
        desabilitado,
        impressoraIp,
        pedidoItemForm,
        tipoEntrega,
      })
      .then((pedidoResult) => {
        return pedidoResult
      })
      .catch((error) => {
        return error
      })

    // if (result.statusCode === 200) {
    //   io.emit("novoPedido", result)
    // }

    return response.status(result.statusCode).json(result)
  }
}

export { CreatePedidoController }
