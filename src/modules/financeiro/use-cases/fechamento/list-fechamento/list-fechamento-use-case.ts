import { inject, injectable } from 'tsyringe'
import { IFechamentoRepository } from '@modules/financeiro/repositories/i-fechamento-repository'
import { IFechamentoDTO } from '@modules/financeiro/dtos/i-fechamento-dto';

interface IRequest {
  search: string,
  page: number,
  rowsPerPage: number,
  order: string,
  filter?: string
}

interface ResponseProps {
  items: IFechamentoDTO[],
  hasNext: boolean
}

@injectable()
class ListFechamentoUseCase {
  constructor(@inject('FechamentoRepository')
    private fechamentoRepository: IFechamentoRepository
  ) {}

  async execute({
    search = '',
    page = 0,
    rowsPerPage = 50,
    order = '',
    filter
  }: IRequest): Promise<ResponseProps> {
    const newPage = page !== 0 ? page - 1 : 0

    const fechamentos = await this.fechamentoRepository.list(
      search,
      newPage,
      rowsPerPage,
      order,
      filter
    )

    const countFechamentos = await this.fechamentoRepository.count(
      search,
      filter
    )

    const numeroFechamento = page * rowsPerPage

    const fechamentosResponse = {
      items: fechamentos.data,
      hasNext: numeroFechamento < countFechamentos.data.count
    }

    return fechamentosResponse
  }
}

export { ListFechamentoUseCase }
