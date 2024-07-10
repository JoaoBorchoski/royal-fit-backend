import { inject, injectable } from 'tsyringe'
import { Bonificacao } from '@modules/cadastros/infra/typeorm/entities/bonificacao'
import { IBonificacaoRepository } from '@modules/cadastros/repositories/i-bonificacao-repository'
import { HttpResponse } from '@shared/helpers'

@injectable()
class DeleteBonificacaoUseCase {
  constructor(@inject('BonificacaoRepository')
    private bonificacaoRepository: IBonificacaoRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const bonificacao = await this.bonificacaoRepository.delete(id)

    return bonificacao
  }
}

export { DeleteBonificacaoUseCase }
