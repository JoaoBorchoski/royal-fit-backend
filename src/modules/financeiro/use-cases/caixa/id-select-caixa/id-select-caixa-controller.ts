import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IdSelectCaixaUseCase } from './id-select-caixa-use-case'

class IdSelectCaixaController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const idSelectCaixaUseCase = container.resolve(IdSelectCaixaUseCase)

    const caixa = await idSelectCaixaUseCase.execute({
      id: id as string
    })

    return response.json(caixa.data)
  }
}

export { IdSelectCaixaController }
