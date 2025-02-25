import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CreateFechamentoUseCase } from './create-fechamento-use-case'
import { HttpResponse } from '@shared/helpers'

class CreateFechamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      data,
      saldoInicial,
      saldoFinal,
      saldoEntradas,
      valorTotal
    } = request.body

    const createFechamentoUseCase = container.resolve(CreateFechamentoUseCase)

    const result = await createFechamentoUseCase.execute({
        data,
        saldoInicial,
        saldoFinal,
        saldoEntradas,
        valorTotal
      })
      .then(fechamentoResult => {
        return fechamentoResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { CreateFechamentoController }
