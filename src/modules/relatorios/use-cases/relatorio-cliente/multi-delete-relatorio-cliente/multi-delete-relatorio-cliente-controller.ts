import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { MultiDeleteRelatorioClienteUseCase } from './multi-delete-relatorio-cliente-use-case'
import { ListRelatorioClienteUseCase } from '../list-relatorio-cliente/list-relatorio-cliente-use-case'

class MultiDeleteRelatorioClienteController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete multi record

    const ids = request.body
    const multiDeleteRelatorioClienteUseCase = container.resolve(MultiDeleteRelatorioClienteUseCase)
    await multiDeleteRelatorioClienteUseCase.execute(ids)


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

export { MultiDeleteRelatorioClienteController }
