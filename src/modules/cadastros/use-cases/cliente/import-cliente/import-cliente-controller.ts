import { Request, Response } from "express"
import { container } from "tsyringe"
import { ImportClienteUseCase } from "./import-cliente-use-case"

class ImportClienteController {
  async handle(request: Request, response: Response): Promise<Response> {
    if (!request.file) {
      return response.status(400).json({ error: "Nenhum arquivo foi enviado." })
    }
    const importClienteUseCase = container.resolve(ImportClienteUseCase)

    const result = await importClienteUseCase.execute({
      file: request.file,
    })

    return response.status(result.statusCode).send(result)
  }
}

export { ImportClienteController }
