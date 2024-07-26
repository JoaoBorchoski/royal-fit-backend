import { Request, Response } from "express"
import { container } from "tsyringe"
import { CreateRelatorioPedidosTotaisUseCase } from "./create-relatorio-pedidos-totais-use-case"
import { HttpResponse } from "@shared/helpers"

class CreateRelatorioPedidosTotaisController {
  async handle(request: Request, response: Response): Promise<Response> {
    console.log("CreateRelatorioPedidosTotaisController -> handle -> request.body")
    const { dataInicio, dataFim } = request.body

    const createRelatorioPedidosTotaisUseCase = container.resolve(CreateRelatorioPedidosTotaisUseCase)

    const result = await createRelatorioPedidosTotaisUseCase
      .execute({
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

export { CreateRelatorioPedidosTotaisController }
