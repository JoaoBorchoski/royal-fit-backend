import { inject, injectable } from 'tsyringe'
import { Cliente } from '@modules/cadastros/infra/typeorm/entities/cliente'
import { IClienteRepository } from '@modules/cadastros/repositories/i-cliente-repository'
import { AppError } from '@shared/errors/app-error'

interface IRequest {
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
class CreateClienteUseCase {
  constructor(@inject('ClienteRepository')
    private clienteRepository: IClienteRepository
  ) {}

  async execute({
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
  }: IRequest): Promise<Cliente> {
    const result = await this.clienteRepository.create({
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
      .then(clienteResult => {
        return clienteResult
      })
      .catch(error => {
        return error
      })

    return result
  }
}

export { CreateClienteUseCase }
