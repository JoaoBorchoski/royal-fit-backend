import { inject, injectable } from 'tsyringe'
import { IMeioPagamentoRepository } from '@modules/cadastros/repositories/i-meio-pagamento-repository'
import { IMeioPagamentoDTO } from '@modules/cadastros/dtos/i-meio-pagamento-dto';

interface IRequest {
  search: string,
  page: number,
  rowsPerPage: number,
  order: string,
  filter?: string
}

interface ResponseProps {
  items: IMeioPagamentoDTO[],
  hasNext: boolean
}

@injectable()
class ListMeioPagamentoUseCase {
  constructor(@inject('MeioPagamentoRepository')
    private meioPagamentoRepository: IMeioPagamentoRepository
  ) {}

  async execute({
    search = '',
    page = 0,
    rowsPerPage = 50,
    order = '',
    filter
  }: IRequest): Promise<ResponseProps> {
    const newPage = page !== 0 ? page - 1 : 0

    const meiosPagamento = await this.meioPagamentoRepository.list(
      search,
      newPage,
      rowsPerPage,
      order,
      filter
    )

    const countMeiosPagamento = await this.meioPagamentoRepository.count(
      search,
      filter
    )

    const numeroMeioPagamento = page * rowsPerPage

    const meiosPagamentoResponse = {
      items: meiosPagamento.data,
      hasNext: numeroMeioPagamento < countMeiosPagamento.data.count
    }

    return meiosPagamentoResponse
  }
}

export { ListMeioPagamentoUseCase }
