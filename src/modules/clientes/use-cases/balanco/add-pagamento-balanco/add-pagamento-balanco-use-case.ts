import { inject, injectable } from "tsyringe"
import { IBalancoRepository } from "@modules/clientes/repositories/i-balanco-repository"
import { HttpResponse } from "@shared/helpers"
import { IPagamentoRepository } from "@modules/clientes/repositories/i-pagamento-repository"
import { ICaixaRepository } from "@modules/financeiro/repositories/i-caixa-repository"
import { IClienteRepository } from "@modules/cadastros/repositories/i-cliente-repository"

interface IRequest {
  id: string
  clienteId: string
  valor: number
  data: Date
  meioPagamentoId: string
  userId: string
}

@injectable()
class AddPagamentoBalancoUseCase {
  constructor(
    @inject("BalancoRepository")
    private balancoRepository: IBalancoRepository,
    @inject("PagamentoRepository")
    private pagamentoRepository: IPagamentoRepository,
    @inject("CaixaRepository")
    private caixaRepository: ICaixaRepository,
    @inject("ClienteRepository")
    private clienteRepository: IClienteRepository
  ) {}

  async execute({ id, clienteId, valor, meioPagamentoId, userId, data }: IRequest): Promise<HttpResponse> {
    const oldBalanco = await this.balancoRepository.get(id)
    const saldoDevedor = oldBalanco.data.saldoDevedor - valor
    const cliente = await this.clienteRepository.get(clienteId)

    const caixa = await this.caixaRepository.create({
      descricao: "Pagamento cliente - " + cliente.data.nome,
      valor,
      clienteId,
      data,
      formaPagamentoId: meioPagamentoId,
    })

    await this.pagamentoRepository.create({
      clienteId,
      valorPago: valor,
      meioPagamentoId,
      userId,
      data,
    })

    const balanco = await this.balancoRepository.update({
      id,
      clienteId,
      saldoDevedor,
    })

    return balanco
  }
}

export { AddPagamentoBalancoUseCase }
