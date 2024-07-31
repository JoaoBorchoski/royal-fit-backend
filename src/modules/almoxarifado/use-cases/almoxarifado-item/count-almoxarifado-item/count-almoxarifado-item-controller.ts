import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CountAlmoxarifadoItemUseCase } from './count-almoxarifado-item-use-case'

class CountAlmoxarifadoItemController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search
    } = request.body

    const countAlmoxarifadoItemUseCase = container.resolve(CountAlmoxarifadoItemUseCase)

    const almoxarifadoItensCount = await countAlmoxarifadoItemUseCase.execute({
      search: search as string
    })

    return response.status(almoxarifadoItensCount.statusCode).json(almoxarifadoItensCount)
  }
}

export { CountAlmoxarifadoItemController }
