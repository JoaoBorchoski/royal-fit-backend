import { inject, injectable } from "tsyringe"
import { IProdutoRepository } from '@modules/cadastros/repositories/i-produto-repository'
import { HttpResponse } from '@shared/helpers/http'

@injectable()
class IdSelectProdutoUseCase {
  constructor(@inject('ProdutoRepository')
    private produtoRepository: IProdutoRepository
  ) {}

  async execute({ id }): Promise<HttpResponse> {
    const produto = await this.produtoRepository.idSelect(id)

    return produto
  }
}

export { IdSelectProdutoUseCase }
