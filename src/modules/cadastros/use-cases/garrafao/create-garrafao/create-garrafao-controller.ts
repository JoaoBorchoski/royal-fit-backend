import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CreateGarrafaoUseCase } from './create-garrafao-use-case'
import { HttpResponse } from '@shared/helpers'

class CreateGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      clienteId,
      quantidade,
      desabilitado
    } = request.body

    const createGarrafaoUseCase = container.resolve(CreateGarrafaoUseCase)

    const result = await createGarrafaoUseCase.execute({
        clienteId,
        quantidade,
        desabilitado
      })
      .then(garrafaoResult => {
        return garrafaoResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { CreateGarrafaoController }
