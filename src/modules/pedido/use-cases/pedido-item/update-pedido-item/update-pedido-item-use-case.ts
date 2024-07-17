import { inject, injectable } from "tsyringe"
import { PedidoItem } from "@modules/pedido/infra/typeorm/entities/pedido-item"
import { IPedidoItemRepository } from "@modules/pedido/repositories/i-pedido-item-repository"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse } from "@shared/helpers"
import { getConnection } from "typeorm"

interface IRequest {
  id: string
  produtoId: string
  pedidoId: string
  quantidade: number
  desabilitado: boolean
}

@injectable()
class UpdatePedidoItemUseCase {
  constructor(
    @inject("PedidoItemRepository")
    private pedidoItemRepository: IPedidoItemRepository
  ) {}

  async execute({ id, produtoId, pedidoId, quantidade, desabilitado }: IRequest): Promise<HttpResponse> {
    const queryRunner = getConnection().createQueryRunner()
    await queryRunner.startTransaction()

    try {
      const pedidoItem = await this.pedidoItemRepository.update(
        {
          id,
          produtoId,
          pedidoId,
          quantidade,
          desabilitado,
        },
        queryRunner.manager
      )

      await queryRunner.commitTransaction()
      return pedidoItem
    } catch (error) {
      await queryRunner.rollbackTransaction()
      return error
    } finally {
      await queryRunner.release()
    }
  }
}

export { UpdatePedidoItemUseCase }
