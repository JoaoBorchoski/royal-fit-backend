import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetRelatorioClienteUseCase } from './get-relatorio-cliente-use-case'

class GetRelatorioClienteController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.params.id
    const getRelatorioClienteUseCase = container.resolve(GetRelatorioClienteUseCase)
    const relatorioCliente = await getRelatorioClienteUseCase.execute(id)

    return response.status(relatorioCliente.statusCode).json(relatorioCliente.data)
  }
}

export { GetRelatorioClienteController }
