import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CreateProdutoUseCase } from './create-produto-use-case'
import { HttpResponse } from '@shared/helpers'

class CreateProdutoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      nome,
      preco,
      descricao,
      desabilitado
    } = request.body

    const createProdutoUseCase = container.resolve(CreateProdutoUseCase)

    const result = await createProdutoUseCase.execute({
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

export { CreateProdutoController }
