import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UpdateDescontoUseCase } from './update-desconto-use-case'

class UpdateDescontoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      clienteId,
      produtoId,
      desconto,
      desabilitado
    } = request.body

    const { id } = request.params

    const updateDescontoUseCase = container.resolve(UpdateDescontoUseCase)

    const result = await updateDescontoUseCase.execute({
        id,
        clienteId,
        produtoId,
        desconto,
        desabilitado
      })
      .then(descontoResult => {
        return descontoResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { UpdateDescontoController }
