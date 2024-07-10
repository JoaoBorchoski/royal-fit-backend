import { inject, injectable } from 'tsyringe'
import { Pedido } from '@modules/pedido/infra/typeorm/entities/pedido'
import { IPedidoRepository } from '@modules/pedido/repositories/i-pedido-repository'
import { AppError } from '@shared/errors/app-error'

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
}

@injectable()
class CreatePedidoUseCase {
  constructor(@inject('PedidoRepository')
    private pedidoRepository: IPedidoRepository
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
    desabilitado
  }: IRequest): Promise<Pedido> {
    const result = await this.pedidoRepository.create({
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
      .then(pedidoResult => {
        return pedidoResult
      })
      .catch(error => {
        return error
      })

    return result
  }
}

export { CreatePedidoUseCase }
