import { inject, injectable } from "tsyringe"
import { IBalancoRepository } from "@modules/clientes/repositories/i-balanco-repository"
import { HttpResponse } from "@shared/helpers"
import { IPagamentoRepository } from "@modules/clientes/repositories/i-pagamento-repository"

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
    private pagamentoRepository: IPagamentoRepository
  ) {}

  async execute({ id, clienteId, valor, meioPagamentoId, userId, data }: IRequest): Promise<HttpResponse> {
    const oldBalanco = await this.balancoRepository.get(id)
    const saldoDevedor = oldBalanco.data.saldoDevedor - valor

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
