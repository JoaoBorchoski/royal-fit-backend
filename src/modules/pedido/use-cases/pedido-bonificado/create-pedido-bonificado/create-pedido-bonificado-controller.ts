import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CreatePedidoBonificadoUseCase } from './create-pedido-bonificado-use-case'
import { HttpResponse } from '@shared/helpers'

class CreatePedidoBonificadoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      clienteId,
      quantidade,
      data,
      isLiberado,
      desabilitado
    } = request.body

    const createPedidoBonificadoUseCase = container.resolve(CreatePedidoBonificadoUseCase)

    const result = await createPedidoBonificadoUseCase.execute({
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

export { CreatePedidoBonificadoController }
