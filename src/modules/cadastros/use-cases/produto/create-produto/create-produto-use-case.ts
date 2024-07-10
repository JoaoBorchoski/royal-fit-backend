import { inject, injectable } from 'tsyringe'
import { Produto } from '@modules/cadastros/infra/typeorm/entities/produto'
import { IProdutoRepository } from '@modules/cadastros/repositories/i-produto-repository'
import { AppError } from '@shared/errors/app-error'

interface IRequest {
  nome: string
  preco: number
  descricao: string
  desabilitado: boolean
}

@injectable()
class CreateProdutoUseCase {
  constructor(@inject('ProdutoRepository')
    private produtoRepository: IProdutoRepository
  ) {}

  async execute({
    nome,
    preco,
    descricao,
    desabilitado
  }: IRequest): Promise<Produto> {
    const result = await this.produtoRepository.create({
        nome,
        preco,
        descricao,
        desabilitado
      })
      .then(produtoResult => {
        return produtoResult
      })
      .catch(error => {
        return error
      })

    return result
  }
}

export { CreateProdutoUseCase }
