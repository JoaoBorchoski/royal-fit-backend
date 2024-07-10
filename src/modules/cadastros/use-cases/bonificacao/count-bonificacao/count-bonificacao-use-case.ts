import { inject, injectable } from 'tsyringe'
import { Bonificacao } from '@modules/cadastros/infra/typeorm/entities/bonificacao'
import { IBonificacaoRepository } from '@modules/cadastros/repositories/i-bonificacao-repository'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  search: string,
  filter?: string
}

@injectable()
class CountBonificacaoUseCase {
  constructor(@inject('BonificacaoRepository')
    private bonificacaoRepository: IBonificacaoRepository
  ) {}

  async execute({
    search,
    filter
  }: IRequest): Promise<HttpResponse> {
    const bonificacoesCount = await this.bonificacaoRepository.count(
      search,
      filter
    )

    return bonificacoesCount
  }
}

export { CountBonificacaoUseCase }
