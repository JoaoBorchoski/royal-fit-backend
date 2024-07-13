import { Request, Response } from "express"
import { container } from "tsyringe"
import { ImportGarrafaoUseCase } from "./import-garrafao-use-case"

class ImportGarrafaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    if (!request.file) {
      return response.status(400).json({ error: "Nenhum arquivo foi enviado." })
    }
    const importGarrafaoUseCase = container.resolve(ImportGarrafaoUseCase)

    const result = await importGarrafaoUseCase.execute({
      file: request.file,
    })

    return response.status(result.statusCode).send(result)
  }
}

export { ImportGarrafaoController }
