import { Request, Response } from "express"
import { container } from "tsyringe"
import { CreateRelatorioDataAndFuncionarioUseCase } from "./create-relatorio-by-data-and-funcionario-use-case"
import { HttpResponse } from "@shared/helpers"

class CreateRelatorioDataAndFuncionarioController {
  async handle(request: Request, response: Response): Promise<Response> {
    console.log("CreateRelatorioDataAndFuncionarioController")
    const id = request.params.id
    const { dataInicio, dataFim } = request.body

    const createRelatorioDataAndFuncionarioUseCase = container.resolve(CreateRelatorioDataAndFuncionarioUseCase)

    const result = await createRelatorioDataAndFuncionarioUseCase
      .execute({
        dataInicio,
        dataFim,
        id,
      })
      .then((relatorioFuncionarioResult) => {
        return relatorioFuncionarioResult
      })
      .catch((error) => {
        return error
      })

    return response.status(result.statusCode).json(result.data)
  }
}

export { CreateRelatorioDataAndFuncionarioController }
