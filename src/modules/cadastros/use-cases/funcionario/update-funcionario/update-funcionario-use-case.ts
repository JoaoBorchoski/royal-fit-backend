import { inject, injectable } from 'tsyringe'
import { Funcionario } from '@modules/cadastros/infra/typeorm/entities/funcionario'
import { IFuncionarioRepository } from '@modules/cadastros/repositories/i-funcionario-repository'
import { AppError } from '@shared/errors/app-error'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  id: string
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
class UpdateFuncionarioUseCase {
  constructor(@inject('FuncionarioRepository')
    private funcionarioRepository: IFuncionarioRepository
  ) {}

  async execute({
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
  }: IRequest): Promise<HttpResponse> {
    const funcionario = await this.funcionarioRepository.update({
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

    return funcionario
  }
}

export { UpdateFuncionarioUseCase }
