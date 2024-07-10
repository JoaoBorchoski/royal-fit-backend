import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CreateBonificacaoUseCase } from './create-bonificacao-use-case'
import { HttpResponse } from '@shared/helpers'

class CreateBonificacaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      clienteId,
      totalVendido,
      bonificacaoDisponivel,
      desabilitado
    } = request.body

    const createBonificacaoUseCase = container.resolve(CreateBonificacaoUseCase)

    const result = await createBonificacaoUseCase.execute({
        clienteId,
        totalVendido,
        bonificacaoDisponivel,
        desabilitado
      })
      .then(bonificacaoResult => {
        return bonificacaoResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { CreateBonificacaoController }
