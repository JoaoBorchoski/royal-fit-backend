import { inject, injectable } from 'tsyringe'
import { IPagamentoRepository } from '@modules/clientes/repositories/i-pagamento-repository'
import { IPagamentoDTO } from '@modules/clientes/dtos/i-pagamento-dto';

interface IRequest {
  search: string,
  page: number,
  rowsPerPage: number,
  order: string,
  filter?: string
}

interface ResponseProps {
  items: IPagamentoDTO[],
  hasNext: boolean
}

@injectable()
class ListPagamentoUseCase {
  constructor(@inject('PagamentoRepository')
    private pagamentoRepository: IPagamentoRepository
  ) {}

  async execute({
    search = '',
    page = 0,
    rowsPerPage = 50,
    order = '',
    filter
  }: IRequest): Promise<ResponseProps> {
    const newPage = page !== 0 ? page - 1 : 0

    const pagamentos = await this.pagamentoRepository.list(
      search,
      newPage,
      rowsPerPage,
      order,
      filter
    )

    const countPagamentos = await this.pagamentoRepository.count(
      search,
      filter
    )

    const numeroPagamento = page * rowsPerPage

    const pagamentosResponse = {
      items: pagamentos.data,
      hasNext: numeroPagamento < countPagamentos.data.count
    }

    return pagamentosResponse
  }
}

export { ListPagamentoUseCase }
