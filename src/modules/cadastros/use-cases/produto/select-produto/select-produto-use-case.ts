import { inject, injectable } from 'tsyringe'
import { IProdutoRepository } from '@modules/cadastros/repositories/i-produto-repository'

interface ResponseProps {
  items?: object[]
  hasNext?: boolean
  value?: string
  label?: string
}

@injectable()
class SelectProdutoUseCase {
  constructor(@inject('ProdutoRepository')
    private produtoRepository: IProdutoRepository
  ) {}

  async execute({
    filter,
  }): Promise<ResponseProps> {
    const produtos = await this.produtoRepository.select(filter)

    const newProdutos = {
      items: produtos.data,
      hasNext: false
    }

    return newProdutos
  }
}

export { SelectProdutoUseCase }
