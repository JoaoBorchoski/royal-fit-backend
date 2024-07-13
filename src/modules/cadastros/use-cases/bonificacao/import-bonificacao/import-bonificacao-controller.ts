import { Request, Response } from "express"
import { container } from "tsyringe"
import { ImportBonificacaoUseCase } from "./import-bonificacao-use-case"

class ImportBonificacaoController {
  async handle(request: Request, response: Response): Promise<Response> {
    if (!request.file) {
      return response.status(400).json({ error: "Nenhum arquivo foi enviado." })
    }
    const importBonificacaoUseCase = container.resolve(ImportBonificacaoUseCase)

    const result = await importBonificacaoUseCase.execute({
      file: request.file,
    })

    return response.status(result.statusCode).send(result)
  }
}

export { ImportBonificacaoController }
