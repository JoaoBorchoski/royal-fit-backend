import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UpdatePagamentoUseCase } from './update-pagamento-use-case'

class UpdatePagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      clienteId,
      valorPago,
      meioPagamentoId,
      desabilitado
    } = request.body

    const { id } = request.params

    const updatePagamentoUseCase = container.resolve(UpdatePagamentoUseCase)

    const result = await updatePagamentoUseCase.execute({
        id,
        clienteId,
        valorPago,
        meioPagamentoId,
        desabilitado
      })
      .then(pagamentoResult => {
        return pagamentoResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { UpdatePagamentoController }
