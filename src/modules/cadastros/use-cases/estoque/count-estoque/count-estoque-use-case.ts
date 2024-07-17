import { inject, injectable } from 'tsyringe'
import { Estoque } from '@modules/cadastros/infra/typeorm/entities/estoque'
import { IEstoqueRepository } from '@modules/cadastros/repositories/i-estoque-repository'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  search: string,
  filter?: string
}

@injectable()
class CountEstoqueUseCase {
  constructor(@inject('EstoqueRepository')
    private estoqueRepository: IEstoqueRepository
  ) {}

  async execute({
    search,
    filter
  }: IRequest): Promise<HttpResponse> {
    const estoquesCount = await this.estoqueRepository.count(
      search,
      filter
    )

    return estoquesCount
  }
}

export { CountEstoqueUseCase }
