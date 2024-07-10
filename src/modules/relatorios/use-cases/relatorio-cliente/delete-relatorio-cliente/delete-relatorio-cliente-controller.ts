import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { DeleteRelatorioClienteUseCase } from './delete-relatorio-cliente-use-case'
import { ListRelatorioClienteUseCase } from '../list-relatorio-cliente/list-relatorio-cliente-use-case'

class DeleteRelatorioClienteController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete record
    
    const id = request.params.id
    const deleteRelatorioClienteUseCase = container.resolve(DeleteRelatorioClienteUseCase)
    await deleteRelatorioClienteUseCase.execute(id)


    // restore list with updated records

    const listRelatorioClienteUseCase = container.resolve(ListRelatorioClienteUseCase)
    const relatoriosClientes = await listRelatorioClienteUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(relatoriosClientes)
  }
}

export { DeleteRelatorioClienteController }
