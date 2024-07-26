import { inject, injectable } from "tsyringe"
import { IPedidoBonificadoRepository } from "@modules/pedido/repositories/i-pedido-bonificado-repository"
import { IPedidoBonificadoDTO } from "@modules/pedido/dtos/i-pedido-bonificado-dto"

interface IRequest {
  search: string
  page: number
  rowsPerPage: number
  order: string
  filter?: string
}

interface ResponseProps {
  items: IPedidoBonificadoDTO[]
  hasNext: boolean
}

@injectable()
class ListPedidoBonificadoUseCase {
  constructor(
    @inject("PedidoBonificadoRepository")
    private pedidoBonificadoRepository: IPedidoBonificadoRepository
  ) {}

  async execute({ search = "", page = 0, rowsPerPage = 50, order = "", filter }: IRequest): Promise<ResponseProps> {
    const newPage = page !== 0 ? page - 1 : 0

    const pedidoBonificados = await this.pedidoBonificadoRepository.list(search, newPage, rowsPerPage, order, filter)

    pedidoBonificados.data.map((pedidoBonificado) => {
      pedidoBonificado.data = pedidoBonificado.data.toLocaleDateString("pt-BR")
    })

    const countPedidoBonificados = await this.pedidoBonificadoRepository.count(search, filter)

    const numeroPedidoBonificado = page * rowsPerPage

    const pedidoBonificadosResponse = {
      items: pedidoBonificados.data,
      hasNext: numeroPedidoBonificado < countPedidoBonificados.data.count,
    }

    return pedidoBonificadosResponse
  }
}

export { ListPedidoBonificadoUseCase }
