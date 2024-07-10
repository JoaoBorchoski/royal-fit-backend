import { inject, injectable } from 'tsyringe'
import { Cliente } from '@modules/cadastros/infra/typeorm/entities/cliente'
import { IClienteRepository } from '@modules/cadastros/repositories/i-cliente-repository'
import { AppError } from '@shared/errors/app-error'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  id: string
  nome: string
  cpfCnpj: string
  email: string
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
class UpdateClienteUseCase {
  constructor(@inject('ClienteRepository')
    private clienteRepository: IClienteRepository
  ) {}

  async execute({
    id,
    nome,
    cpfCnpj,
    email,
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
    const cliente = await this.clienteRepository.update({
      id,
      nome,
      cpfCnpj,
      email,
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

    return cliente
  }
}

export { UpdateClienteUseCase }
