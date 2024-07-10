import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CountRelatorioClienteUseCase } from './count-relatorio-cliente-use-case'

class CountRelatorioClienteController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search
    } = request.body

    const countRelatorioClienteUseCase = container.resolve(CountRelatorioClienteUseCase)

    const relatoriosClientesCount = await countRelatorioClienteUseCase.execute({
      search: search as string
    })

    return response.status(relatoriosClientesCount.statusCode).json(relatoriosClientesCount)
  }
}

export { CountRelatorioClienteController }
