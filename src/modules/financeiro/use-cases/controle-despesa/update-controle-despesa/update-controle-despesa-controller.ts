import { Request, Response } from "express"
import { container } from "tsyringe"
import { UpdateControleDespesaUseCase } from "./update-controle-despesa-use-case"

class UpdateControleDespesaController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { dataEmissao, dataVencimento, descricao, valor, status, categoria, codigoBarras, pedidoId, clienteId, formaPagamentoId } = request.body

    const { id } = request.params

    const updateControleDespesaUseCase = container.resolve(UpdateControleDespesaUseCase)

    const result = await updateControleDespesaUseCase
      .execute({
        id,
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

export { UpdateControleDespesaController }
