import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CreateMeioPagamentoUseCase } from './create-meio-pagamento-use-case'
import { HttpResponse } from '@shared/helpers'

class CreateMeioPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      nome,
      descricao,
      desabilitado
    } = request.body

    const createMeioPagamentoUseCase = container.resolve(CreateMeioPagamentoUseCase)

    const result = await createMeioPagamentoUseCase.execute({
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

export { CreateMeioPagamentoController }
