import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CountRelatorioFuncionarioUseCase } from './count-relatorio-funcionario-use-case'

class CountRelatorioFuncionarioController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search
    } = request.body

    const countRelatorioFuncionarioUseCase = container.resolve(CountRelatorioFuncionarioUseCase)

    const relatoriosFuncionariosCount = await countRelatorioFuncionarioUseCase.execute({
      search: search as string
    })

    return response.status(relatoriosFuncionariosCount.statusCode).json(relatoriosFuncionariosCount)
  }
}

export { CountRelatorioFuncionarioController }
