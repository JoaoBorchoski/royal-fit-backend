import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UpdateProdutoUseCase } from './update-produto-use-case'

class UpdateProdutoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      nome,
      preco,
      descricao,
      desabilitado
    } = request.body

    const { id } = request.params

    const updateProdutoUseCase = container.resolve(UpdateProdutoUseCase)

    const result = await updateProdutoUseCase.execute({
        id,
        nome,
        preco,
        descricao,
        desabilitado
      })
      .then(produtoResult => {
        return produtoResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { UpdateProdutoController }
