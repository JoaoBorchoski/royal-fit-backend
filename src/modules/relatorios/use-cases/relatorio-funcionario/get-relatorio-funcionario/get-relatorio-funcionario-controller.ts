import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetRelatorioFuncionarioUseCase } from './get-relatorio-funcionario-use-case'

class GetRelatorioFuncionarioController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.params.id
    const getRelatorioFuncionarioUseCase = container.resolve(GetRelatorioFuncionarioUseCase)
    const relatorioFuncionario = await getRelatorioFuncionarioUseCase.execute(id)

    return response.status(relatorioFuncionario.statusCode).json(relatorioFuncionario.data)
  }
}

export { GetRelatorioFuncionarioController }
