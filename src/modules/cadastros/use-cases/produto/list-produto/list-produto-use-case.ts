import { inject, injectable } from 'tsyringe'
import { IProdutoRepository } from '@modules/cadastros/repositories/i-produto-repository'
import { IProdutoDTO } from '@modules/cadastros/dtos/i-produto-dto';

interface IRequest {
  search: string,
  page: number,
  rowsPerPage: number,
  order: string,
  filter?: string
}

interface ResponseProps {
  items: IProdutoDTO[],
  hasNext: boolean
}

@injectable()
class ListProdutoUseCase {
  constructor(@inject('ProdutoRepository')
    private produtoRepository: IProdutoRepository
  ) {}

  async execute({
    search = '',
    page = 0,
    rowsPerPage = 50,
    order = '',
    filter
  }: IRequest): Promise<ResponseProps> {
    const newPage = page !== 0 ? page - 1 : 0

    const produtos = await this.produtoRepository.list(
      search,
      newPage,
      rowsPerPage,
      order,
      filter
    )

    const countProdutos = await this.produtoRepository.count(
      search,
      filter
    )

    const numeroProduto = page * rowsPerPage

    const produtosResponse = {
      items: produtos.data,
      hasNext: numeroProduto < countProdutos.data.count
    }

    return produtosResponse
  }
}

export { ListProdutoUseCase }
