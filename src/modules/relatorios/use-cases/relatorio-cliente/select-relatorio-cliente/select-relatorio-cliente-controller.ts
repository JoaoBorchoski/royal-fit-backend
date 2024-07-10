import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { SelectRelatorioClienteUseCase } from './select-relatorio-cliente-use-case'

class SelectRelatorioClienteController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filter } = request.query

    const selectRelatorioClienteUseCase = container.resolve(SelectRelatorioClienteUseCase)

    const relatoriosClientes = await selectRelatorioClienteUseCase.execute({
      filter: filter as string,
    })

    return response.json(relatoriosClientes)
  }
}

export { SelectRelatorioClienteController }
