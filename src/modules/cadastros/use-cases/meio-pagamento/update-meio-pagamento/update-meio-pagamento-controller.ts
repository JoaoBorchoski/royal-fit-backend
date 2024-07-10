import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UpdateMeioPagamentoUseCase } from './update-meio-pagamento-use-case'

class UpdateMeioPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      nome,
      descricao,
      desabilitado
    } = request.body

    const { id } = request.params

    const updateMeioPagamentoUseCase = container.resolve(UpdateMeioPagamentoUseCase)

    const result = await updateMeioPagamentoUseCase.execute({
        id,
        nome,
        descricao,
        desabilitado
      })
      .then(meioPagamentoResult => {
        return meioPagamentoResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { UpdateMeioPagamentoController }
