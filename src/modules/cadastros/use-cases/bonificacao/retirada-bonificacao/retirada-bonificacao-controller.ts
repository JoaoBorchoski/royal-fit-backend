import { Request, Response } from "express"
import { container } from "tsyringe"
import { RetiradaBonificacaoUseCase } from "./retirada-bonificacao-use-case"

class RetiradaBonificacaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { clienteId, quantidade } = request.body

    const { id } = request.params

    const retiradaBonificacaoUseCase = container.resolve(RetiradaBonificacaoUseCase)

    const result = await retiradaBonificacaoUseCase
      .execute({
        id,
        clienteId,
        quantidade,
      })
      .then((bonificacaoResult) => {
        return bonificacaoResult
      })
      .catch((error) => {
        console.log(error)
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { RetiradaBonificacaoController }
