import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IdSelectRelatorioFuncionarioUseCase } from './id-select-relatorio-funcionario-use-case'

class IdSelectRelatorioFuncionarioController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const idSelectRelatorioFuncionarioUseCase = container.resolve(IdSelectRelatorioFuncionarioUseCase)

    const relatorioFuncionario = await idSelectRelatorioFuncionarioUseCase.execute({
      id: id as string
    })

    return response.json(relatorioFuncionario.data)
  }
}

export { IdSelectRelatorioFuncionarioController }
