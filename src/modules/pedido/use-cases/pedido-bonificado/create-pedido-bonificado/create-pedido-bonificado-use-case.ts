import { inject, injectable } from "tsyringe"
import { PedidoBonificado } from "@modules/pedido/infra/typeorm/entities/pedido-bonificado"
import { IPedidoBonificadoRepository } from "@modules/pedido/repositories/i-pedido-bonificado-repository"
import { AppError } from "@shared/errors/app-error"
import { IGarrafaoRepository } from "@modules/cadastros/repositories/i-garrafao-repository"

interface IRequest {
  clienteId: string
  quantidade: number
  data: Date
  isLiberado: boolean
  desabilitado: boolean
}

@injectable()
class CreatePedidoBonificadoUseCase {
  constructor(
    @inject("PedidoBonificadoRepository")
    private pedidoBonificadoRepository: IPedidoBonificadoRepository,
    @inject("GarrafaoRepository")
    private garrafaoRepository: IGarrafaoRepository
  ) {}

  async execute({ clienteId, quantidade, data, isLiberado, desabilitado }: IRequest): Promise<PedidoBonificado> {
    try {
      const garrafao = await this.garrafaoRepository.getByClienteId(clienteId)

      if (!garrafao.data || garrafao.data.quantidade < quantidade) {
        throw new AppError("Quantidade de garrafões insuficiente")
      }

      const result = await this.pedidoBonificadoRepository
        .create({
          clienteId,
          quantidade,
          data,
          isLiberado,
          desabilitado,
        })
        .then((pedidoBonificadoResult) => {
          return pedidoBonificadoResult
        })
        .catch((error) => {
          return error
        })

      return result
    } catch (error) {
      return error
    }
  }
}

export { CreatePedidoBonificadoUseCase }
