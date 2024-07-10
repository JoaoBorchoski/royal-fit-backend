import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { MultiDeleteRelatorioFuncionarioUseCase } from './multi-delete-relatorio-funcionario-use-case'
import { ListRelatorioFuncionarioUseCase } from '../list-relatorio-funcionario/list-relatorio-funcionario-use-case'

class MultiDeleteRelatorioFuncionarioController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete multi record

    const ids = request.body
    const multiDeleteRelatorioFuncionarioUseCase = container.resolve(MultiDeleteRelatorioFuncionarioUseCase)
    await multiDeleteRelatorioFuncionarioUseCase.execute(ids)


    // restore list with updated records

    const listRelatorioFuncionarioUseCase = container.resolve(ListRelatorioFuncionarioUseCase)
    const relatoriosFuncionarios = await listRelatorioFuncionarioUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(relatoriosFuncionarios)
  }
}

export { MultiDeleteRelatorioFuncionarioController }
