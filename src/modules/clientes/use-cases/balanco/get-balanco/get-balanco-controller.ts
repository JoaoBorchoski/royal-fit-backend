import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetBalancoUseCase } from './get-balanco-use-case'

class GetBalancoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.params.id
    const getBalancoUseCase = container.resolve(GetBalancoUseCase)
    const balanco = await getBalancoUseCase.execute(id)

    return response.status(balanco.statusCode).json(balanco.data)
  }
}

export { GetBalancoController }
