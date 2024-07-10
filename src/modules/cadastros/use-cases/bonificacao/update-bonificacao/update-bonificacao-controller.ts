import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UpdateBonificacaoUseCase } from './update-bonificacao-use-case'

class UpdateBonificacaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      clienteId,
      totalVendido,
      bonificacaoDisponivel,
      desabilitado
    } = request.body

    const { id } = request.params

    const updateBonificacaoUseCase = container.resolve(UpdateBonificacaoUseCase)

    const result = await updateBonificacaoUseCase.execute({
        id,
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

export { UpdateBonificacaoController }
