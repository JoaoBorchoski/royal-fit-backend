import { inject, injectable } from 'tsyringe'
import { PedidoBonificado } from '@modules/pedido/infra/typeorm/entities/pedido-bonificado'
import { IPedidoBonificadoRepository } from '@modules/pedido/repositories/i-pedido-bonificado-repository'
import { HttpResponse } from '@shared/helpers'

@injectable()
class DeletePedidoBonificadoUseCase {
  constructor(@inject('PedidoBonificadoRepository')
    private pedidoBonificadoRepository: IPedidoBonificadoRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const pedidoBonificado = await this.pedidoBonificadoRepository.delete(id)

    return pedidoBonificado
  }
}

export { DeletePedidoBonificadoUseCase }