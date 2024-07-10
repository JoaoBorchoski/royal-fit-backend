import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UpdateFuncionarioUseCase } from './update-funcionario-use-case'

class UpdateFuncionarioController {
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
      desabilitado
    } = request.body

    const { id } = request.params

    const updateFuncionarioUseCase = container.resolve(UpdateFuncionarioUseCase)

    const result = await updateFuncionarioUseCase.execute({
        id,
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
        desabilitado
      })
      .then(funcionarioResult => {
        return funcionarioResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { UpdateFuncionarioController }
