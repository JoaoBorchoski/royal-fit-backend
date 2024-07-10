import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UpdateRelatorioClienteUseCase } from './update-relatorio-cliente-use-case'

class UpdateRelatorioClienteController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      clienteId,
      dataInicio,
      dataFim,
      relatório,
      desabilitado
    } = request.body

    const { id } = request.params

    const updateRelatorioClienteUseCase = container.resolve(UpdateRelatorioClienteUseCase)

    const result = await updateRelatorioClienteUseCase.execute({
        id,
        clienteId,
        dataInicio,
        dataFim,
        relatório,
        desabilitado
      })
      .then(relatorioClienteResult => {
        return relatorioClienteResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { UpdateRelatorioClienteController }
