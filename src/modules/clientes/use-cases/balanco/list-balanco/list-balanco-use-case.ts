import { inject, injectable } from 'tsyringe'
import { IBalancoRepository } from '@modules/clientes/repositories/i-balanco-repository'
import { IBalancoDTO } from '@modules/clientes/dtos/i-balanco-dto';

interface IRequest {
  search: string,
  page: number,
  rowsPerPage: number,
  order: string,
  filter?: string
}

interface ResponseProps {
  items: IBalancoDTO[],
  hasNext: boolean
}

@injectable()
class ListBalancoUseCase {
  constructor(@inject('BalancoRepository')
    private balancoRepository: IBalancoRepository
  ) {}

  async execute({
    search = '',
    page = 0,
    rowsPerPage = 50,
    order = '',
    filter
  }: IRequest): Promise<ResponseProps> {
    const newPage = page !== 0 ? page - 1 : 0

    const balancos = await this.balancoRepository.list(
      search,
      newPage,
      rowsPerPage,
      order,
      filter
    )

    const countBalancos = await this.balancoRepository.count(
      search,
      filter
    )

    const numeroBalanco = page * rowsPerPage

    const balancosResponse = {
      items: balancos.data,
      hasNext: numeroBalanco < countBalancos.data.count
    }

    return balancosResponse
  }
}

export { ListBalancoUseCase }
