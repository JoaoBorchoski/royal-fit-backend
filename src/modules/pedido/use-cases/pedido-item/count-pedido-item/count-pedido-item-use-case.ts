import { inject, injectable } from 'tsyringe'
import { PedidoItem } from '@modules/pedido/infra/typeorm/entities/pedido-item'
import { IPedidoItemRepository } from '@modules/pedido/repositories/i-pedido-item-repository'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  search: string,
  filter?: string
}

@injectable()
class CountPedidoItemUseCase {
  constructor(@inject('PedidoItemRepository')
    private pedidoItemRepository: IPedidoItemRepository
  ) {}

  async execute({
    search,
    filter
  }: IRequest): Promise<HttpResponse> {
    const pedidoItensCount = await this.pedidoItemRepository.count(
      search,
      filter
    )

    return pedidoItensCount
  }
}

export { CountPedidoItemUseCase }
