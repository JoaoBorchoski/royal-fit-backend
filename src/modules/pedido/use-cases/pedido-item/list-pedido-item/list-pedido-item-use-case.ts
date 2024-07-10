import { inject, injectable } from 'tsyringe'
import { IPedidoItemRepository } from '@modules/pedido/repositories/i-pedido-item-repository'
import { IPedidoItemDTO } from '@modules/pedido/dtos/i-pedido-item-dto';

interface IRequest {
  search: string,
  page: number,
  rowsPerPage: number,
  order: string,
  filter?: string
}

interface ResponseProps {
  items: IPedidoItemDTO[],
  hasNext: boolean
}

@injectable()
class ListPedidoItemUseCase {
  constructor(@inject('PedidoItemRepository')
    private pedidoItemRepository: IPedidoItemRepository
  ) {}

  async execute({
    search = '',
    page = 0,
    rowsPerPage = 50,
    order = '',
    filter
  }: IRequest): Promise<ResponseProps> {
    const newPage = page !== 0 ? page - 1 : 0

    const pedidoItens = await this.pedidoItemRepository.list(
      search,
      newPage,
      rowsPerPage,
      order,
      filter
    )

    const countPedidoItens = await this.pedidoItemRepository.count(
      search,
      filter
    )

    const numeroPedidoItem = page * rowsPerPage

    const pedidoItensResponse = {
      items: pedidoItens.data,
      hasNext: numeroPedidoItem < countPedidoItens.data.count
    }

    return pedidoItensResponse
  }
}

export { ListPedidoItemUseCase }
