import { inject, injectable } from 'tsyringe'
import { IPedidoItemRepository } from '@modules/pedido/repositories/i-pedido-item-repository'

interface ResponseProps {
  items?: object[]
  hasNext?: boolean
  value?: string
  label?: string
}

@injectable()
class SelectPedidoItemUseCase {
  constructor(@inject('PedidoItemRepository')
    private pedidoItemRepository: IPedidoItemRepository
  ) {}

  async execute({
    filter,
  }): Promise<ResponseProps> {
    const pedidoItens = await this.pedidoItemRepository.select(filter)

    const newPedidoItens = {
      items: pedidoItens.data,
      hasNext: false
    }

    return newPedidoItens
  }
}

export { SelectPedidoItemUseCase }
