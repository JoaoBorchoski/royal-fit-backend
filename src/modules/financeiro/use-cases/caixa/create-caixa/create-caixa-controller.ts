import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CreateCaixaUseCase } from './create-caixa-use-case'
import { HttpResponse } from '@shared/helpers'

class CreateCaixaController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      descricao,
      valor,
      data,
      pedidoId,
      clienteId,
      formaPagamentoId
    } = request.body

    const createCaixaUseCase = container.resolve(CreateCaixaUseCase)

    const result = await createCaixaUseCase.execute({
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

export { CreateCaixaController }
