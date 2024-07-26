import { inject, injectable } from 'tsyringe'
import { IPedidoBonificadoRepository } from '@modules/pedido/repositories/i-pedido-bonificado-repository'

interface ResponseProps {
  items?: object[]
  hasNext?: boolean
  value?: string
  label?: string
}

@injectable()
class SelectPedidoBonificadoUseCase {
  constructor(@inject('PedidoBonificadoRepository')
    private pedidoBonificadoRepository: IPedidoBonificadoRepository
  ) {}

  async execute({
    filter,
  }): Promise<ResponseProps> {
    const pedidoBonificados = await this.pedidoBonificadoRepository.select(filter)

    const newPedidoBonificados = {
      items: pedidoBonificados.data,
      hasNext: false
    }

    return newPedidoBonificados
  }
}

export { SelectPedidoBonificadoUseCase }
