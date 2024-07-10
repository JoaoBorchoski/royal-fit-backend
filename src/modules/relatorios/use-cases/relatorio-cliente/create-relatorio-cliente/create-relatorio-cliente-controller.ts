import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CreateRelatorioClienteUseCase } from './create-relatorio-cliente-use-case'
import { HttpResponse } from '@shared/helpers'

class CreateRelatorioClienteController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      clienteId,
      dataInicio,
      dataFim,
      relatório,
      desabilitado
    } = request.body

    const createRelatorioClienteUseCase = container.resolve(CreateRelatorioClienteUseCase)

    const result = await createRelatorioClienteUseCase.execute({
        clienteId,
        dataInicio,
        dataFim,
        relatório,
        desabilitado
      })
      .then(relatorioClienteResult => {
        return relatorioClienteResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { CreateRelatorioClienteController }
