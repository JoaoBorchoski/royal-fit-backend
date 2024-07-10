import { inject, injectable } from 'tsyringe'
import { Produto } from '@modules/cadastros/infra/typeorm/entities/produto'
import { IProdutoRepository } from '@modules/cadastros/repositories/i-produto-repository'
import { HttpResponse } from '@shared/helpers'

@injectable()
class DeleteProdutoUseCase {
  constructor(@inject('ProdutoRepository')
    private produtoRepository: IProdutoRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const produto = await this.produtoRepository.delete(id)

    return produto
  }
}

export { DeleteProdutoUseCase }
