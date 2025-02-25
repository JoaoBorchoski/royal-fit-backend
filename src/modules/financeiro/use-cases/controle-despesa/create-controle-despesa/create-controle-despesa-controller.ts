import { Request, Response } from "express"
import { container } from "tsyringe"
import { CreateControleDespesaUseCase } from "./create-controle-despesa-use-case"
import { HttpResponse } from "@shared/helpers"

class CreateControleDespesaController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { dataEmissao, dataVencimento, descricao, valor, status, categoria, codigoBarras, pedidoId, clienteId, formaPagamentoId } = request.body

    const createControleDespesaUseCase = container.resolve(CreateControleDespesaUseCase)

    const result = await createControleDespesaUseCase
      .execute({
        dataEmissao,
        dataVencimento,
        descricao,
        valor,
        status,
        categoria,
        codigoBarras,
        pedidoId,
        clienteId,
        formaPagamentoId,
      })
      .then((controleDespesaResult) => {
        return controleDespesaResult
      })
      .catch((error) => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { CreateControleDespesaController }
