import { inject, injectable } from 'tsyringe'
import { Pedido } from '@modules/pedido/infra/typeorm/entities/pedido'
import { IPedidoRepository } from '@modules/pedido/repositories/i-pedido-repository'
import { AppError } from '@shared/errors/app-error'
import { HttpResponse } from '@shared/helpers'

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
}

@injectable()
class UpdatePedidoUseCase {
  constructor(@inject('PedidoRepository')
    private pedidoRepository: IPedidoRepository
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
    desabilitado
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
      desabilitado
    })

    return pedido
  }
}

export { UpdatePedidoUseCase }
