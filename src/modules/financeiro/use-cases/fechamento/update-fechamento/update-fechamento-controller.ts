import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UpdateFechamentoUseCase } from './update-fechamento-use-case'

class UpdateFechamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      data,
      saldoInicial,
      saldoFinal,
      saldoEntradas,
      valorTotal
    } = request.body

    const { id } = request.params

    const updateFechamentoUseCase = container.resolve(UpdateFechamentoUseCase)

    const result = await updateFechamentoUseCase.execute({
        id,
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

export { UpdateFechamentoController }
