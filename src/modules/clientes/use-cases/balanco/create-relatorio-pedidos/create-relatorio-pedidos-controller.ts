import { Request, Response } from "express"
import { container } from "tsyringe"
import { CreateRelatorioPedidoUseCase } from "./create-relatorio-pedidos-use-case"
import { HttpResponse } from "@shared/helpers"

class CreateRelatorioPedidoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { dataInicio, dataFim } = request.body

    const clienteId = request.params.id

    const createRelatorioPedidoUseCase = container.resolve(CreateRelatorioPedidoUseCase)

    const result = await createRelatorioPedidoUseCase
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

export { CreateRelatorioPedidoController }
