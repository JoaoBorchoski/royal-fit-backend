import { inject, injectable } from 'tsyringe'
import { IBonificacaoRepository } from '@modules/cadastros/repositories/i-bonificacao-repository';
import { HttpResponse } from '@shared/helpers';

@injectable()
class MultiDeleteBonificacaoUseCase {
  constructor(@inject('BonificacaoRepository')
    private bonificacaoRepository: IBonificacaoRepository
  ) {}

  async execute(ids: string[]): Promise<HttpResponse> {
    const bonificacao = await this.bonificacaoRepository.multiDelete(ids)

    return bonificacao
  }
}

export { MultiDeleteBonificacaoUseCase }
