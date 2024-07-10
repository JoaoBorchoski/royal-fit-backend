import { inject, injectable } from 'tsyringe'
import { PedidoItem } from '@modules/pedido/infra/typeorm/entities/pedido-item'
import { IPedidoItemRepository } from '@modules/pedido/repositories/i-pedido-item-repository'
import { AppError } from '@shared/errors/app-error'

interface IRequest {
  produtoId: string
  pedidoId: string
  quantidade: number
  desabilitado: boolean
}

@injectable()
class CreatePedidoItemUseCase {
  constructor(@inject('PedidoItemRepository')
    private pedidoItemRepository: IPedidoItemRepository
  ) {}

  async execute({
    produtoId,
    pedidoId,
    quantidade,
    desabilitado
  }: IRequest): Promise<PedidoItem> {
    const result = await this.pedidoItemRepository.create({
        produtoId,
        pedidoId,
        quantidade,
        desabilitado
      })
      .then(pedidoItemResult => {
        return pedidoItemResult
      })
      .catch(error => {
        return error
      })

    return result
  }
}

export { CreatePedidoItemUseCase }
