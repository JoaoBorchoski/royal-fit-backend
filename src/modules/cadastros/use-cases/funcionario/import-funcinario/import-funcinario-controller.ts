import { Request, Response } from "express"
import { container } from "tsyringe"
import { ImportFuncionarioUseCase } from "./import-funcinario-use-case"

class ImportFuncionarioController {
  async handle(request: Request, response: Response): Promise<Response> {
    if (!request.file) {
      return response.status(400).json({ error: "Nenhum arquivo foi enviado." })
    }
    const importFuncionarioUseCase = container.resolve(ImportFuncionarioUseCase)

    const result = await importFuncionarioUseCase.execute({
      file: request.file,
    })

    return response.status(result.statusCode).send(result)
  }
}

export { ImportFuncionarioController }
