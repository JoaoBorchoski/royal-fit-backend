import { Request, Response } from "express"
import { container } from "tsyringe"
import { SelectEntradaGarrafaoUseCase } from "./select-entrada-garrafao-use-case"

class SelectEntradaGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filter, clienteId } = request.query

    const selectEntradaGarrafaoUseCase = container.resolve(SelectEntradaGarrafaoUseCase)

    const entradasGarrafao = await selectEntradaGarrafaoUseCase.execute({
      filter: filter as string,
      clienteId: clienteId as string,
    })

    return response.json(entradasGarrafao)
  }
}

export { SelectEntradaGarrafaoController }
