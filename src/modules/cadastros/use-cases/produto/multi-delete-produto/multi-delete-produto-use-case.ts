import { inject, injectable } from 'tsyringe'
import { IProdutoRepository } from '@modules/cadastros/repositories/i-produto-repository';
import { HttpResponse } from '@shared/helpers';

@injectable()
class MultiDeleteProdutoUseCase {
  constructor(@inject('ProdutoRepository')
    private produtoRepository: IProdutoRepository
  ) {}

  async execute(ids: string[]): Promise<HttpResponse> {
    const produto = await this.produtoRepository.multiDelete(ids)

    return produto
  }
}

export { MultiDeleteProdutoUseCase }
