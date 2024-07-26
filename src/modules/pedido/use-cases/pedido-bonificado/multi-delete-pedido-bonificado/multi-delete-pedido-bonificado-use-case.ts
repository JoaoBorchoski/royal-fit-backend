import { inject, injectable } from 'tsyringe'
import { IPedidoBonificadoRepository } from '@modules/pedido/repositories/i-pedido-bonificado-repository';
import { HttpResponse } from '@shared/helpers';

@injectable()
class MultiDeletePedidoBonificadoUseCase {
  constructor(@inject('PedidoBonificadoRepository')
    private pedidoBonificadoRepository: IPedidoBonificadoRepository
  ) {}

  async execute(ids: string[]): Promise<HttpResponse> {
    const pedidoBonificado = await this.pedidoBonificadoRepository.multiDelete(ids)

    return pedidoBonificado
  }
}

export { MultiDeletePedidoBonificadoUseCase }
