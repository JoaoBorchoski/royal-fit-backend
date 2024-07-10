import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IdSelectRelatorioClienteUseCase } from './id-select-relatorio-cliente-use-case'

class IdSelectRelatorioClienteController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const idSelectRelatorioClienteUseCase = container.resolve(IdSelectRelatorioClienteUseCase)

    const relatorioCliente = await idSelectRelatorioClienteUseCase.execute({
      id: id as string
    })

    return response.json(relatorioCliente.data)
  }
}

export { IdSelectRelatorioClienteController }
