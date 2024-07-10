import { inject, injectable } from 'tsyringe'
import { Funcionario } from '@modules/cadastros/infra/typeorm/entities/funcionario'
import { IFuncionarioRepository } from '@modules/cadastros/repositories/i-funcionario-repository'
import { AppError } from '@shared/errors/app-error'

interface IRequest {
  nome: string
  cpf: string
  email: string
  cargo: string
  cep: string
  estadoId: string
  cidadeId: string
  bairro: string
  endereco: string
  numero: number
  complemento: string
  telefone: string
  usuarioId: string
  desabilitado: boolean
}

@injectable()
class CreateFuncionarioUseCase {
  constructor(@inject('FuncionarioRepository')
    private funcionarioRepository: IFuncionarioRepository
  ) {}

  async execute({
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
  }: IRequest): Promise<Funcionario> {
    const result = await this.funcionarioRepository.create({
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

    return result
  }
}

export { CreateFuncionarioUseCase }
