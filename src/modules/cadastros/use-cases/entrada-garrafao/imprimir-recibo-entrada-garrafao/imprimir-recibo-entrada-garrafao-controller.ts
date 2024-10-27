import { Request, Response } from "express"
import { container } from "tsyringe"
import { ImprimirReciboEntradaGarrafaoUseCase } from "./imprimir-recibo-entrada-garrafao-use-case"

class ImprimirReciboEntradaGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { entradaId, impressoraIp } = request.body
    const getEntradaGarrafaoUseCase = container.resolve(ImprimirReciboEntradaGarrafaoUseCase)
    const entradaGarrafao = await getEntradaGarrafaoUseCase.execute(entradaId, impressoraIp)

    return response.status(entradaGarrafao.statusCode).json(entradaGarrafao.data)
  }
}

export { ImprimirReciboEntradaGarrafaoController }
