import { inject, injectable } from 'tsyringe'
import { PedidoItem } from '@modules/pedido/infra/typeorm/entities/pedido-item'
import { IPedidoItemRepository } from '@modules/pedido/repositories/i-pedido-item-repository'
import { AppError } from '@shared/errors/app-error'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  id: string
  produtoId: string
  pedidoId: string
  quantidade: number
  desabilitado: boolean
}

@injectable()
class UpdatePedidoItemUseCase {
  constructor(@inject('PedidoItemRepository')
    private pedidoItemRepository: IPedidoItemRepository
  ) {}

  async execute({
    id,
    produtoId,
    pedidoId,
    quantidade,
    desabilitado
  }: IRequest): Promise<HttpResponse> {
    const pedidoItem = await this.pedidoItemRepository.update({
      id,
      produtoId,
      pedidoId,
      quantidade,
      desabilitado
    })

    return pedidoItem
  }
}

export { UpdatePedidoItemUseCase }
