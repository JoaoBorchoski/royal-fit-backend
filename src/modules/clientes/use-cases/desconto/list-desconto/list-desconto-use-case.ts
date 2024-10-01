import { inject, injectable } from 'tsyringe'
import { IDescontoRepository } from '@modules/clientes/repositories/i-desconto-repository'
import { IDescontoDTO } from '@modules/clientes/dtos/i-desconto-dto';

interface IRequest {
  search: string,
  page: number,
  rowsPerPage: number,
  order: string,
  filter?: string
}

interface ResponseProps {
  items: IDescontoDTO[],
  hasNext: boolean
}

@injectable()
class ListDescontoUseCase {
  constructor(@inject('DescontoRepository')
    private descontoRepository: IDescontoRepository
  ) {}

  async execute({
    search = '',
    page = 0,
    rowsPerPage = 50,
    order = '',
    filter
  }: IRequest): Promise<ResponseProps> {
    const newPage = page !== 0 ? page - 1 : 0

    const descontos = await this.descontoRepository.list(
      search,
      newPage,
      rowsPerPage,
      order,
      filter
    )

    const countDescontos = await this.descontoRepository.count(
      search,
      filter
    )

    const numeroDesconto = page * rowsPerPage

    const descontosResponse = {
      items: descontos.data,
      hasNext: numeroDesconto < countDescontos.data.count
    }

    return descontosResponse
  }
}

export { ListDescontoUseCase }
