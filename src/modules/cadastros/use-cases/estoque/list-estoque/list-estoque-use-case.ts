import { inject, injectable } from 'tsyringe'
import { IEstoqueRepository } from '@modules/cadastros/repositories/i-estoque-repository'
import { IEstoqueDTO } from '@modules/cadastros/dtos/i-estoque-dto';

interface IRequest {
  search: string,
  page: number,
  rowsPerPage: number,
  order: string,
  filter?: string
}

interface ResponseProps {
  items: IEstoqueDTO[],
  hasNext: boolean
}

@injectable()
class ListEstoqueUseCase {
  constructor(@inject('EstoqueRepository')
    private estoqueRepository: IEstoqueRepository
  ) {}

  async execute({
    search = '',
    page = 0,
    rowsPerPage = 50,
    order = '',
    filter
  }: IRequest): Promise<ResponseProps> {
    const newPage = page !== 0 ? page - 1 : 0

    const estoques = await this.estoqueRepository.list(
      search,
      newPage,
      rowsPerPage,
      order,
      filter
    )

    const countEstoques = await this.estoqueRepository.count(
      search,
      filter
    )

    const numeroEstoque = page * rowsPerPage

    const estoquesResponse = {
      items: estoques.data,
      hasNext: numeroEstoque < countEstoques.data.count
    }

    return estoquesResponse
  }
}

export { ListEstoqueUseCase }
