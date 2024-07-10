import { inject, injectable } from 'tsyringe'
import { IStatusPagamentoRepository } from '@modules/cadastros/repositories/i-status-pagamento-repository'
import { IStatusPagamentoDTO } from '@modules/cadastros/dtos/i-status-pagamento-dto';

interface IRequest {
  search: string,
  page: number,
  rowsPerPage: number,
  order: string,
  filter?: string
}

interface ResponseProps {
  items: IStatusPagamentoDTO[],
  hasNext: boolean
}

@injectable()
class ListStatusPagamentoUseCase {
  constructor(@inject('StatusPagamentoRepository')
    private statusPagamentoRepository: IStatusPagamentoRepository
  ) {}

  async execute({
    search = '',
    page = 0,
    rowsPerPage = 50,
    order = '',
    filter
  }: IRequest): Promise<ResponseProps> {
    const newPage = page !== 0 ? page - 1 : 0

    const statusPagamento = await this.statusPagamentoRepository.list(
      search,
      newPage,
      rowsPerPage,
      order,
      filter
    )

    const countStatusPagamento = await this.statusPagamentoRepository.count(
      search,
      filter
    )

    const numeroStatusPagamento = page * rowsPerPage

    const statusPagamentoResponse = {
      items: statusPagamento.data,
      hasNext: numeroStatusPagamento < countStatusPagamento.data.count
    }

    return statusPagamentoResponse
  }
}

export { ListStatusPagamentoUseCase }
