import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { SelectAlmoxarifadoItemUseCase } from './select-almoxarifado-item-use-case'

class SelectAlmoxarifadoItemController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filter } = request.query

    const selectAlmoxarifadoItemUseCase = container.resolve(SelectAlmoxarifadoItemUseCase)

    const almoxarifadoItens = await selectAlmoxarifadoItemUseCase.execute({
      filter: filter as string,
    })

    return response.json(almoxarifadoItens)
  }
}

export { SelectAlmoxarifadoItemController }
