import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CountBalancoUseCase } from './count-balanco-use-case'

class CountBalancoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search
    } = request.body

    const countBalancoUseCase = container.resolve(CountBalancoUseCase)

    const balancosCount = await countBalancoUseCase.execute({
      search: search as string
    })

    return response.status(balancosCount.statusCode).json(balancosCount)
  }
}

export { CountBalancoController }
