import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CreateEntradaGarrafaoUseCase } from './create-entrada-garrafao-use-case'
import { HttpResponse } from '@shared/helpers'

class CreateEntradaGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      clienteId,
      quantidade,
      isRoyalfit,
      desabilitado
    } = request.body

    const createEntradaGarrafaoUseCase = container.resolve(CreateEntradaGarrafaoUseCase)

    const result = await createEntradaGarrafaoUseCase.execute({
        clienteId,
        quantidade,
        isRoyalfit,
        desabilitado
      })
      .then(entradaGarrafaoResult => {
        return entradaGarrafaoResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { CreateEntradaGarrafaoController }
