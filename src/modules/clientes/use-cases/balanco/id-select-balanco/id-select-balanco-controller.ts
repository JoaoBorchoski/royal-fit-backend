import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IdSelectBalancoUseCase } from './id-select-balanco-use-case'

class IdSelectBalancoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const idSelectBalancoUseCase = container.resolve(IdSelectBalancoUseCase)

    const balanco = await idSelectBalancoUseCase.execute({
      id: id as string
    })

    return response.json(balanco.data)
  }
}

export { IdSelectBalancoController }
