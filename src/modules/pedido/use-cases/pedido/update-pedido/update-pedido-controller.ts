import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UpdatePedidoUseCase } from './update-pedido-use-case'

class UpdatePedidoController {
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
      desabilitado
    } = request.body

    const { id } = request.params

    const updatePedidoUseCase = container.resolve(UpdatePedidoUseCase)

    const result = await updatePedidoUseCase.execute({
        id,
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
        desabilitado
      })
      .then(pedidoResult => {
        return pedidoResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { UpdatePedidoController }
