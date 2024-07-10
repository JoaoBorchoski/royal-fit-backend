import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListRelatorioFuncionarioUseCase } from './list-relatorio-funcionario-use-case'

class ListRelatorioFuncionarioController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search,
      page,
      pageSize,
      order,
      filter
    } = request.body

    const listRelatorioFuncionarioUseCase = container.resolve(ListRelatorioFuncionarioUseCase)

    const relatoriosFuncionarios = await listRelatorioFuncionarioUseCase.execute({
      search: search as string,
      page: Number(page) as number,
      rowsPerPage: Number(pageSize) as number,
      order: order as string,
      filter: filter as string
    })

    return response.json(relatoriosFuncionarios)
  }
}

export { ListRelatorioFuncionarioController }
