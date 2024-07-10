import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CreateRelatorioFuncionarioUseCase } from './create-relatorio-funcionario-use-case'
import { HttpResponse } from '@shared/helpers'

class CreateRelatorioFuncionarioController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      funcionarioId,
      dataInicio,
      dataFim,
      relatório,
      desabilitado
    } = request.body

    const createRelatorioFuncionarioUseCase = container.resolve(CreateRelatorioFuncionarioUseCase)

    const result = await createRelatorioFuncionarioUseCase.execute({
        funcionarioId,
        dataInicio,
        dataFim,
        relatório,
        desabilitado
      })
      .then(relatorioFuncionarioResult => {
        return relatorioFuncionarioResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { CreateRelatorioFuncionarioController }
