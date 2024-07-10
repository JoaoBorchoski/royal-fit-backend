import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UpdateRelatorioFuncionarioUseCase } from './update-relatorio-funcionario-use-case'

class UpdateRelatorioFuncionarioController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      funcionarioId,
      dataInicio,
      dataFim,
      relatório,
      desabilitado
    } = request.body

    const { id } = request.params

    const updateRelatorioFuncionarioUseCase = container.resolve(UpdateRelatorioFuncionarioUseCase)

    const result = await updateRelatorioFuncionarioUseCase.execute({
        id,
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

export { UpdateRelatorioFuncionarioController }
