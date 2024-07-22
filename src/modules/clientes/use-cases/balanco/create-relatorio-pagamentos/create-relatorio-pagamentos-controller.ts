import { Request, Response } from "express"
import { container } from "tsyringe"
import { CreateRelatorioPagamentoUseCase } from "./create-relatorio-pagamentos-use-case"
import { HttpResponse } from "@shared/helpers"

class CreateRelatorioPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { dataInicio, dataFim } = request.body

    const clienteId = request.params.id

    const createRelatorioPagamentoUseCase = container.resolve(CreateRelatorioPagamentoUseCase)

    const result = await createRelatorioPagamentoUseCase
      .execute({
        clienteId,
        dataInicio,
        dataFim,
      })
      .then((relatorioFuncionarioResult) => {
        return relatorioFuncionarioResult
      })
      .catch((error) => {
        console.log(error)
        return error
      })

    return response.status(result.statusCode).json(result.data)
  }
}

export { CreateRelatorioPagamentoController }
