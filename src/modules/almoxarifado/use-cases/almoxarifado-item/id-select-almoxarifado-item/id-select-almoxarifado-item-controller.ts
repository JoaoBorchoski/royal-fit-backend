import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IdSelectAlmoxarifadoItemUseCase } from './id-select-almoxarifado-item-use-case'

class IdSelectAlmoxarifadoItemController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const idSelectAlmoxarifadoItemUseCase = container.resolve(IdSelectAlmoxarifadoItemUseCase)

    const almoxarifadoItem = await idSelectAlmoxarifadoItemUseCase.execute({
      id: id as string
    })

    return response.json(almoxarifadoItem.data)
  }
}

export { IdSelectAlmoxarifadoItemController }
