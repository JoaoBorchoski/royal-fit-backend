import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UpdateCaixaUseCase } from './update-caixa-use-case'

class UpdateCaixaController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      descricao,
      valor,
      data,
      pedidoId,
      clienteId,
      formaPagamentoId
    } = request.body

    const { id } = request.params

    const updateCaixaUseCase = container.resolve(UpdateCaixaUseCase)

    const result = await updateCaixaUseCase.execute({
        id,
        descricao,
        valor,
        data,
        pedidoId,
        clienteId,
        formaPagamentoId
      })
      .then(caixaResult => {
        return caixaResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { UpdateCaixaController }
