import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CreateBalancoUseCase } from './create-balanco-use-case'
import { HttpResponse } from '@shared/helpers'

class CreateBalancoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      clienteId,
      saldoDevedor,
      desabilitado
    } = request.body

    const createBalancoUseCase = container.resolve(CreateBalancoUseCase)

    const result = await createBalancoUseCase.execute({
        clienteId,
        saldoDevedor,
        desabilitado
      })
      .then(balancoResult => {
        return balancoResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { CreateBalancoController }
