import { Request, Response } from "express"
import { container } from "tsyringe"
import { ImportEstoqueUseCase } from "./import-estoque-use-case"

class ImportEstoqueController {
  async handle(request: Request, response: Response): Promise<Response> {
    if (!request.file) {
      return response.status(400).json({ error: "Nenhum arquivo foi enviado." })
    }
    const importEstoqueUseCase = container.resolve(ImportEstoqueUseCase)

    const result = await importEstoqueUseCase.execute({
      file: request.file,
    })

    return response.status(result.statusCode).send(result)
  }
}

export { ImportEstoqueController }
