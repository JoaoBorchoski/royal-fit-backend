import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetAlmoxarifadoItemUseCase } from './get-almoxarifado-item-use-case'

class GetAlmoxarifadoItemController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.params.id
    const getAlmoxarifadoItemUseCase = container.resolve(GetAlmoxarifadoItemUseCase)
    const almoxarifadoItem = await getAlmoxarifadoItemUseCase.execute(id)

    return response.status(almoxarifadoItem.statusCode).json(almoxarifadoItem.data)
  }
}

export { GetAlmoxarifadoItemController }
