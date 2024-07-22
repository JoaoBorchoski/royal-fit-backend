import { inject, injectable } from "tsyringe"
import { Pedido } from "@modules/pedido/infra/typeorm/entities/pedido"
import { IPedidoRepository } from "@modules/pedido/repositories/i-pedido-repository"
import { HttpResponse } from "@shared/helpers"

@injectable()
class GetPedidoByClienteUseCase {
  constructor(
    @inject("PedidoRepository")
    private pedidoRepository: IPedidoRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const pedido = await this.pedidoRepository.getByClienteId(id)

    return pedido
  }
}

export { GetPedidoByClienteUseCase }
