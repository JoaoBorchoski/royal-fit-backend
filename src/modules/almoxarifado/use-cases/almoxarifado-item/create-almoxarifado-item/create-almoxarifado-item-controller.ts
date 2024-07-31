import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CreateAlmoxarifadoItemUseCase } from './create-almoxarifado-item-use-case'
import { HttpResponse } from '@shared/helpers'

class CreateAlmoxarifadoItemController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      item,
      quantidade,
      quantidadeMin,
      desabilitado
    } = request.body

    const createAlmoxarifadoItemUseCase = container.resolve(CreateAlmoxarifadoItemUseCase)

    const result = await createAlmoxarifadoItemUseCase.execute({
        item,
        quantidade,
        quantidadeMin,
        desabilitado
      })
      .then(almoxarifadoItemResult => {
        return almoxarifadoItemResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { CreateAlmoxarifadoItemController }
