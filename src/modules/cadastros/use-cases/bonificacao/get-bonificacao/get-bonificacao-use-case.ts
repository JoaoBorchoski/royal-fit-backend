import { inject, injectable } from 'tsyringe'
import { Bonificacao } from '@modules/cadastros/infra/typeorm/entities/bonificacao'
import { IBonificacaoRepository } from '@modules/cadastros/repositories/i-bonificacao-repository'
import { HttpResponse } from '@shared/helpers'

@injectable()
class GetBonificacaoUseCase {
  constructor(@inject('BonificacaoRepository')
    private bonificacaoRepository: IBonificacaoRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const bonificacao = await this.bonificacaoRepository.get(id)

    return bonificacao
  }
}

export { GetBonificacaoUseCase }
