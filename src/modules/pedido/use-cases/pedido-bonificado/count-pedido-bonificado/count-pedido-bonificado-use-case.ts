import { inject, injectable } from 'tsyringe'
import { PedidoBonificado } from '@modules/pedido/infra/typeorm/entities/pedido-bonificado'
import { IPedidoBonificadoRepository } from '@modules/pedido/repositories/i-pedido-bonificado-repository'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  search: string,
  filter?: string
}

@injectable()
class CountPedidoBonificadoUseCase {
  constructor(@inject('PedidoBonificadoRepository')
    private pedidoBonificadoRepository: IPedidoBonificadoRepository
  ) {}

  async execute({
    search,
    filter
  }: IRequest): Promise<HttpResponse> {
    const pedidoBonificadosCount = await this.pedidoBonificadoRepository.count(
      search,
      filter
    )

    return pedidoBonificadosCount
  }
}

export { CountPedidoBonificadoUseCase }
