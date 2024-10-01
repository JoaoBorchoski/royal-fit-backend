import { inject, injectable } from "tsyringe"
import { Cliente } from "@modules/cadastros/infra/typeorm/entities/cliente"
import { IClienteRepository } from "@modules/cadastros/repositories/i-cliente-repository"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse } from "@shared/helpers"
import { IDescontoRepository } from "@modules/clientes/repositories/i-desconto-repository"

interface IRequest {
  id: string
  nome: string
  cpfCnpj: string
  email: string
  isBonificado: boolean
  desconto: number
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
  descontos: any
}

@injectable()
class UpdateClienteUseCase {
  constructor(
    @inject("ClienteRepository")
    private clienteRepository: IClienteRepository,
    @inject("DescontoRepository")
    private descontoRepository: IDescontoRepository
  ) {}

  async execute({
    id,
    nome,
    cpfCnpj,
    email,
    isBonificado,
    desconto,
    cep,
    estadoId,
    cidadeId,
    bairro,
    endereco,
    numero,
    complemento,
    telefone,
    usuarioId,
    desabilitado,
    descontos,
  }: IRequest): Promise<HttpResponse> {
    const cliente = await this.clienteRepository.update({
      id,
      nome,
      cpfCnpj,
      email,
      isBonificado,
      desconto,
      cep,
      estadoId,
      cidadeId,
      bairro,
      endereco,
      numero,
      complemento,
      telefone,
      usuarioId,
      desabilitado,
    })

    await this.descontoRepository.deleteByClienteId(id)

    for await (const desconto of descontos) {
      await this.descontoRepository.create({
        clienteId: id,
        produtoId: desconto.produtoId,
        desconto: desconto.desconto,
        desabilitado: false,
      })
    }

    return cliente
  }
}

export { UpdateClienteUseCase }
