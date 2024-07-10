import { inject, injectable } from 'tsyringe'
import { Produto } from '@modules/cadastros/infra/typeorm/entities/produto'
import { IProdutoRepository } from '@modules/cadastros/repositories/i-produto-repository'
import { AppError } from '@shared/errors/app-error'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  id: string
  nome: string
  preco: number
  descricao: string
  desabilitado: boolean
}

@injectable()
class UpdateProdutoUseCase {
  constructor(@inject('ProdutoRepository')
    private produtoRepository: IProdutoRepository
  ) {}

  async execute({
    id,
    nome,
    preco,
    descricao,
    desabilitado
  }: IRequest): Promise<HttpResponse> {
    const produto = await this.produtoRepository.update({
      id,
      nome,
      preco,
      descricao,
      desabilitado
    })

    return produto
  }
}

export { UpdateProdutoUseCase }
