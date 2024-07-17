import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UpdateEstoqueUseCase } from './update-estoque-use-case'

class UpdateEstoqueController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      produtoId,
      quantidade,
      desabilitado
    } = request.body

    const { id } = request.params

    const updateEstoqueUseCase = container.resolve(UpdateEstoqueUseCase)

    const result = await updateEstoqueUseCase.execute({
        id,
        produtoId,
        quantidade,
        desabilitado
      })
      .then(estoqueResult => {
        return estoqueResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { UpdateEstoqueController }
