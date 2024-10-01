import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IdSelectDescontoUseCase } from './id-select-desconto-use-case'

class IdSelectDescontoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const idSelectDescontoUseCase = container.resolve(IdSelectDescontoUseCase)

    const desconto = await idSelectDescontoUseCase.execute({
      id: id as string
    })

    return response.json(desconto.data)
  }
}

export { IdSelectDescontoController }
