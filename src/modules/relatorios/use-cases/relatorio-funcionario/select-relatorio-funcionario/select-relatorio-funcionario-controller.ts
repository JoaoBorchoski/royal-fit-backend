import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { SelectRelatorioFuncionarioUseCase } from './select-relatorio-funcionario-use-case'

class SelectRelatorioFuncionarioController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filter } = request.query

    const selectRelatorioFuncionarioUseCase = container.resolve(SelectRelatorioFuncionarioUseCase)

    const relatoriosFuncionarios = await selectRelatorioFuncionarioUseCase.execute({
      filter: filter as string,
    })

    return response.json(relatoriosFuncionarios)
  }
}

export { SelectRelatorioFuncionarioController }
