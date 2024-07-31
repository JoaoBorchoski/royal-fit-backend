import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UpdateAlmoxarifadoItemUseCase } from './update-almoxarifado-item-use-case'

class UpdateAlmoxarifadoItemController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      item,
      quantidade,
      quantidadeMin,
      desabilitado
    } = request.body

    const { id } = request.params

    const updateAlmoxarifadoItemUseCase = container.resolve(UpdateAlmoxarifadoItemUseCase)

    const result = await updateAlmoxarifadoItemUseCase.execute({
        id,
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

export { UpdateAlmoxarifadoItemController }
