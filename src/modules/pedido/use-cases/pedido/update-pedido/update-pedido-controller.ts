import { Request, Response } from "express"
import { container } from "tsyringe"
import { UpdatePedidoUseCase } from "./update-pedido-use-case"
// import { io } from "@shared/infra/http/server"

class UpdatePedidoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      sequencial,
      clienteId,
      data,
      hora,
      valorTotal,
      desconto,
      descricao,
      isLiberado,
      funcionarioId,
      meioPagamentoId,
      statusPagamentoId,
      isPagamentoPosterior,
      desabilitado,
      pedidoItemForm,
      impressoraIp,
      tipoEntrega,
      impressao,
    } = request.body

    const { id } = request.params

    const updatePedidoUseCase = container.resolve(UpdatePedidoUseCase)

    const result = await updatePedidoUseCase
      .execute({
        id,
        sequencial,
        clienteId,
        data,
        hora,
        valorTotal,
        desconto,
        descricao,
        isLiberado,
        funcionarioId,
        meioPagamentoId,
        statusPagamentoId,
        isPagamentoPosterior,
        desabilitado,
        pedidoItemForm,
        impressoraIp,
        tipoEntrega,
        impressao,
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

export { UpdatePedidoController }
