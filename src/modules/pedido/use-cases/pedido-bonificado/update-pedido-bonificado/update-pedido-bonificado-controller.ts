import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UpdatePedidoBonificadoUseCase } from './update-pedido-bonificado-use-case'

class UpdatePedidoBonificadoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      clienteId,
      quantidade,
      data,
      isLiberado,
      desabilitado
    } = request.body

    const { id } = request.params

    const updatePedidoBonificadoUseCase = container.resolve(UpdatePedidoBonificadoUseCase)

    const result = await updatePedidoBonificadoUseCase.execute({
        id,
        clienteId,
        quantidade,
        data,
        isLiberado,
        desabilitado
      })
      .then(pedidoBonificadoResult => {
        return pedidoBonificadoResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { UpdatePedidoBonificadoController }
