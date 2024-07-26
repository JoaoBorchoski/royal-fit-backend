import { inject, injectable } from "tsyringe"
import { IPedidoBonificadoRepository } from '@modules/pedido/repositories/i-pedido-bonificado-repository'
import { HttpResponse } from '@shared/helpers/http'

@injectable()
class IdSelectPedidoBonificadoUseCase {
  constructor(@inject('PedidoBonificadoRepository')
    private pedidoBonificadoRepository: IPedidoBonificadoRepository
  ) {}

  async execute({ id }): Promise<HttpResponse> {
    const pedidoBonificado = await this.pedidoBonificadoRepository.idSelect(id)

    return pedidoBonificado
  }
}

export { IdSelectPedidoBonificadoUseCase }
