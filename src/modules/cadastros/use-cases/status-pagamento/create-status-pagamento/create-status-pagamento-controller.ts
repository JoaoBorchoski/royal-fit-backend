import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CreateStatusPagamentoUseCase } from './create-status-pagamento-use-case'
import { HttpResponse } from '@shared/helpers'

class CreateStatusPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      nome,
      descricao,
      desabilitado
    } = request.body

    const createStatusPagamentoUseCase = container.resolve(CreateStatusPagamentoUseCase)

    const result = await createStatusPagamentoUseCase.execute({
        nome,
        descricao,
        desabilitado
      })
      .then(statusPagamentoResult => {
        return statusPagamentoResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { CreateStatusPagamentoController }
