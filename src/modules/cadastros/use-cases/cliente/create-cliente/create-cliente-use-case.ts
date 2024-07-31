import { inject, injectable } from "tsyringe"
import { Cliente } from "@modules/cadastros/infra/typeorm/entities/cliente"
import { IClienteRepository } from "@modules/cadastros/repositories/i-cliente-repository"
import { AppError } from "@shared/errors/app-error"
import { IBonificacaoRepository } from "@modules/cadastros/repositories/i-bonificacao-repository"
import { IBalancoRepository } from "@modules/clientes/repositories/i-balanco-repository"
import { IUserRepository } from "@modules/authentication/repositories/i-user-repository"
import { IGarrafaoRepository } from "@modules/cadastros/repositories/i-garrafao-repository"

interface IRequest {
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
}

@injectable()
class CreateClienteUseCase {
  constructor(
    @inject("ClienteRepository")
    private clienteRepository: IClienteRepository,
    @inject("BonificacaoRepository")
    private bonificacaoRepository: IBonificacaoRepository,
    @inject("BalancoRepository")
    private balancoRepository: IBalancoRepository,
    @inject("UserRepository")
    private UserRepository: IUserRepository,
    @inject("GarrafaoRepository")
    private garrafaoRepository: IGarrafaoRepository
  ) {}

  async execute({
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
  }: IRequest): Promise<Cliente> {
    try {
      const findByEmail = await this.UserRepository.findByEmail(email)

      if (findByEmail) {
        throw new AppError("User already exists", 400)
      }

      const result = await this.clienteRepository
        .create({
          nome,
          cpfCnpj: cpfCnpj.toString().replace(/[^\d]+/g, ""),
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
        .then((clienteResult) => {
          return clienteResult
        })
        .catch((error) => {
          return error
        })

      const bonificacaoAlreadyExists = await this.bonificacaoRepository.getByClienteId(result.data.id)
      const balancoAlreadyExists = await this.balancoRepository.getByClienteId(result.data.id)
      const garrafaAlreadyExists = await this.garrafaoRepository.getByClienteId(result.data.id)

      if (!bonificacaoAlreadyExists.data) {
        await this.bonificacaoRepository.create({
          clienteId: result.data.id,
          bonificacaoDisponivel: 0,
          totalVendido: 0,
          desabilitado: false,
        })
      }
      if (!balancoAlreadyExists.data) {
        await this.balancoRepository.create({
          clienteId: result.data.id,
          saldoDevedor: 0,
          desabilitado: false,
        })
      }
      if (!garrafaAlreadyExists.data) {
        await this.garrafaoRepository.create({
          clienteId: result.data.id,
          quantidade: 0,
          desabilitado: false,
        })
      }

      return result
    } catch (error) {
      return error
    }
  }
}

export { CreateClienteUseCase }
