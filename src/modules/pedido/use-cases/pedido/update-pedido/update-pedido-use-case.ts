import { inject, injectable } from "tsyringe"
import { Pedido } from "@modules/pedido/infra/typeorm/entities/pedido"
import { IPedidoRepository } from "@modules/pedido/repositories/i-pedido-repository"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse } from "@shared/helpers"
import { IPedidoItemRepository } from "@modules/pedido/repositories/i-pedido-item-repository"

interface IRequest {
  id: string
  sequencial: number
  clienteId: string
  data: Date
  hora: string
  valorTotal: number
  desconto: number
  funcionarioId: string
  meioPagamentoId: string
  statusPagamentoId: string
  isPagamentoPosterior: boolean
  desabilitado: boolean
  pedidoItemForm: any[]
}

@injectable()
class UpdatePedidoUseCase {
  constructor(
    @inject("PedidoRepository")
    private pedidoRepository: IPedidoRepository,
    @inject("PedidoItemRepository")
    private pedidoItemRepository: IPedidoItemRepository
  ) {}

  async execute({
    id,
    sequencial,
    clienteId,
    data,
    hora,
    valorTotal,
    desconto,
    funcionarioId,
    meioPagamentoId,
    statusPagamentoId,
    isPagamentoPosterior,
    desabilitado,
    pedidoItemForm,
  }: IRequest): Promise<HttpResponse> {
    const pedido = await this.pedidoRepository.update({
      id,
      sequencial,
      clienteId,
      data,
      hora,
      valorTotal,
      desconto,
      funcionarioId,
      meioPagamentoId,
      statusPagamentoId,
      isPagamentoPosterior,
      desabilitado,
    })

    await this.pedidoItemRepository.deleteByPedidoId(id)

    for await (const pedidoItem of pedidoItemForm) {
      await this.pedidoItemRepository.create({
        pedidoId: pedido.data.id,
        produtoId: pedidoItem.produtoId,
        quantidade: pedidoItem.quantidade,
      })
    }

    return pedido
  }
}

export { UpdatePedidoUseCase }
