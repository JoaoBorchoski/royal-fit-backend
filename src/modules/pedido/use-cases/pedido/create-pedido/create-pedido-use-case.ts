import { inject, injectable } from "tsyringe"
import { Pedido } from "@modules/pedido/infra/typeorm/entities/pedido"
import { IPedidoRepository } from "@modules/pedido/repositories/i-pedido-repository"
import { AppError } from "@shared/errors/app-error"
import { IPedidoItemRepository } from "@modules/pedido/repositories/i-pedido-item-repository"

interface IRequest {
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
class CreatePedidoUseCase {
  constructor(
    @inject("PedidoRepository")
    private pedidoRepository: IPedidoRepository,
    @inject("PedidoItemRepository")
    private pedidoItemRepository: IPedidoItemRepository
  ) {}

  async execute({
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
  }: IRequest): Promise<Pedido> {
    try {
      const totalPedidos = await this.pedidoRepository.count("", "")

      console.log(funcionarioId, "funcionarioId")
      console.log(meioPagamentoId, "meioPagamentoId")
      console.log(statusPagamentoId, "statusPagamentoId")

      const result = await this.pedidoRepository
        .create({
          sequencial: totalPedidos.data.count + 1,
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
        .then((pedidoResult) => {
          return pedidoResult
        })
        .catch((error) => {
          return error
        })

      for await (const pedidoItem of pedidoItemForm) {
        await this.pedidoItemRepository.create({
          pedidoId: result.data.id,
          produtoId: pedidoItem.produtoId,
          quantidade: pedidoItem.quantidade,
        })
      }

      return result
    } catch (error) {
      throw new AppError(error)
    }
  }
}

export { CreatePedidoUseCase }
