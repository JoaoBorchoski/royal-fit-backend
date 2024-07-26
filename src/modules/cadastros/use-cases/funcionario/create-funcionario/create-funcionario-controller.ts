import { Request, Response } from "express"
import { container } from "tsyringe"
import { CreateFuncionarioUseCase } from "./create-funcionario-use-case"
import { HttpResponse } from "@shared/helpers"

class CreateFuncionarioController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      nome,
      cpf,
      email,
      cargo,
      cep,
      estadoId,
      cidadeId,
      bairro,
      endereco,
      numero,
      complemento,
      telefone,
      usuarioId,
      profileId,
      desabilitado,
    } = request.body

    const createFuncionarioUseCase = container.resolve(CreateFuncionarioUseCase)

    const result = await createFuncionarioUseCase
      .execute({
        nome,
        cpf,
        email,
        cargo,
        cep,
        estadoId,
        cidadeId,
        bairro,
        endereco,
        numero,
        complemento,
        telefone,
        usuarioId,
        profileId,
        desabilitado,
      })
      .then((funcionarioResult) => {
        return funcionarioResult
      })
      .catch((error) => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { CreateFuncionarioController }
