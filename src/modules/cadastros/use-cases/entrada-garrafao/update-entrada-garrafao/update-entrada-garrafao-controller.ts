import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UpdateEntradaGarrafaoUseCase } from './update-entrada-garrafao-use-case'

class UpdateEntradaGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      clienteId,
      quantidade,
      isRoyalfit,
      desabilitado
    } = request.body

    const { id } = request.params

    const updateEntradaGarrafaoUseCase = container.resolve(UpdateEntradaGarrafaoUseCase)

    const result = await updateEntradaGarrafaoUseCase.execute({
        id,
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

export { UpdateEntradaGarrafaoController }
