import { inject, injectable } from 'tsyringe'
import { Pedido } from '@modules/pedido/infra/typeorm/entities/pedido'
import { IPedidoRepository } from '@modules/pedido/repositories/i-pedido-repository'
import { HttpResponse } from '@shared/helpers'

@injectable()
class GetPedidoUseCase {
  constructor(@inject('PedidoRepository')
    private pedidoRepository: IPedidoRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const pedido = await this.pedidoRepository.get(id)

    return pedido
  }
}

export { GetPedidoUseCase }
