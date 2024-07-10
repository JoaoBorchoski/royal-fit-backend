import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UpdateStatusPagamentoUseCase } from './update-status-pagamento-use-case'

class UpdateStatusPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      nome,
      descricao,
      desabilitado
    } = request.body

    const { id } = request.params

    const updateStatusPagamentoUseCase = container.resolve(UpdateStatusPagamentoUseCase)

    const result = await updateStatusPagamentoUseCase.execute({
        id,
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

export { UpdateStatusPagamentoController }
