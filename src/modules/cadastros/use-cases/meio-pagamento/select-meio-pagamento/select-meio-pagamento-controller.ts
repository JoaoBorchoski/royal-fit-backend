import { Request, Response } from "express"
import { container } from "tsyringe"
import { SelectMeioPagamentoUseCase } from "./select-meio-pagamento-use-case"

class SelectMeioPagamentoController {
  async handle(request: Request, response: Response): Promise<Response> {
    console.log("SelectMeioPagamentoController.handle()")
    const { filter } = request.query

    const selectMeioPagamentoUseCase = container.resolve(SelectMeioPagamentoUseCase)

    const meiosPagamento = await selectMeioPagamentoUseCase.execute({
      filter: filter as string,
    })

    return response.json(meiosPagamento)
  }
}

export { SelectMeioPagamentoController }
