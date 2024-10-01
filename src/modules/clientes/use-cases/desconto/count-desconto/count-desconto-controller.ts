import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CountDescontoUseCase } from './count-desconto-use-case'

class CountDescontoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search
    } = request.body

    const countDescontoUseCase = container.resolve(CountDescontoUseCase)

    const descontosCount = await countDescontoUseCase.execute({
      search: search as string
    })

    return response.status(descontosCount.statusCode).json(descontosCount)
  }
}

export { CountDescontoController }
