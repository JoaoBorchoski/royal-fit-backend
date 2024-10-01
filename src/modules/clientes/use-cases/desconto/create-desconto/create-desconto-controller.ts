import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CreateDescontoUseCase } from './create-desconto-use-case'
import { HttpResponse } from '@shared/helpers'

class CreateDescontoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      clienteId,
      produtoId,
      desconto,
      desabilitado
    } = request.body

    const createDescontoUseCase = container.resolve(CreateDescontoUseCase)

    const result = await createDescontoUseCase.execute({
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

export { CreateDescontoController }
