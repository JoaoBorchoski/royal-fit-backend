import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UpdateBalancoUseCase } from './update-balanco-use-case'

class UpdateBalancoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      clienteId,
      saldoDevedor,
      desabilitado
    } = request.body

    const { id } = request.params

    const updateBalancoUseCase = container.resolve(UpdateBalancoUseCase)

    const result = await updateBalancoUseCase.execute({
        id,
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

export { UpdateBalancoController }
