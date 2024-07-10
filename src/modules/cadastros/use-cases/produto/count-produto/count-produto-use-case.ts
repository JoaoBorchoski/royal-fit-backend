import { inject, injectable } from 'tsyringe'
import { Produto } from '@modules/cadastros/infra/typeorm/entities/produto'
import { IProdutoRepository } from '@modules/cadastros/repositories/i-produto-repository'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  search: string,
  filter?: string
}

@injectable()
class CountProdutoUseCase {
  constructor(@inject('ProdutoRepository')
    private produtoRepository: IProdutoRepository
  ) {}

  async execute({
    search,
    filter
  }: IRequest): Promise<HttpResponse> {
    const produtosCount = await this.produtoRepository.count(
      search,
      filter
    )

    return produtosCount
  }
}

export { CountProdutoUseCase }
