import { inject, injectable } from "tsyringe"
import { IBonificacaoRepository } from '@modules/cadastros/repositories/i-bonificacao-repository'
import { HttpResponse } from '@shared/helpers/http'

@injectable()
class IdSelectBonificacaoUseCase {
  constructor(@inject('BonificacaoRepository')
    private bonificacaoRepository: IBonificacaoRepository
  ) {}

  async execute({ id }): Promise<HttpResponse> {
    const bonificacao = await this.bonificacaoRepository.idSelect(id)

    return bonificacao
  }
}

export { IdSelectBonificacaoUseCase }
