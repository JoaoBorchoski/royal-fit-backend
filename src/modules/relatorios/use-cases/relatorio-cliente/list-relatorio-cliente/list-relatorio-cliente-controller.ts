import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListRelatorioClienteUseCase } from './list-relatorio-cliente-use-case'

class ListRelatorioClienteController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search,
      page,
      pageSize,
      order,
      filter
    } = request.body

    const listRelatorioClienteUseCase = container.resolve(ListRelatorioClienteUseCase)

    const relatoriosClientes = await listRelatorioClienteUseCase.execute({
      search: search as string,
      page: Number(page) as number,
      rowsPerPage: Number(pageSize) as number,
      order: order as string,
      filter: filter as string
    })

    return response.json(relatoriosClientes)
  }
}

export { ListRelatorioClienteController }
