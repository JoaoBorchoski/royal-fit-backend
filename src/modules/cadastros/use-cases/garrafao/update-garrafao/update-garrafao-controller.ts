import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UpdateGarrafaoUseCase } from './update-garrafao-use-case'

class UpdateGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      clienteId,
      quantidade,
      desabilitado
    } = request.body

    const { id } = request.params

    const updateGarrafaoUseCase = container.resolve(UpdateGarrafaoUseCase)

    const result = await updateGarrafaoUseCase.execute({
        id,
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

export { UpdateGarrafaoController }
