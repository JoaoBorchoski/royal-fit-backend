import { Request, Response } from "express"
import { container } from "tsyringe"
import { GetCepInfoUseCase } from "./get-cep-info-use-case"

class GetCepInfoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const cep = request.params.cep
    const getCepInfoUseCase = container.resolve(GetCepInfoUseCase)
    const cepInfo = await getCepInfoUseCase.execute(cep)

    return response.status(cepInfo.statusCode).json(cepInfo.data)
  }
}

export { GetCepInfoController }
