import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { DeleteRelatorioFuncionarioUseCase } from './delete-relatorio-funcionario-use-case'
import { ListRelatorioFuncionarioUseCase } from '../list-relatorio-funcionario/list-relatorio-funcionario-use-case'

class DeleteRelatorioFuncionarioController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete record
    
    const id = request.params.id
    const deleteRelatorioFuncionarioUseCase = container.resolve(DeleteRelatorioFuncionarioUseCase)
    await deleteRelatorioFuncionarioUseCase.execute(id)


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

export { DeleteRelatorioFuncionarioController }
