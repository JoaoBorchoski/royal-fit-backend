import { inject, injectable } from "tsyringe"
import { ICaixaRepository } from '@modules/financeiro/repositories/i-caixa-repository'
import { HttpResponse } from '@shared/helpers/http'

@injectable()
class IdSelectCaixaUseCase {
  constructor(@inject('CaixaRepository')
    private caixaRepository: ICaixaRepository
  ) {}

  async execute({ id }): Promise<HttpResponse> {
    const caixa = await this.caixaRepository.idSelect(id)

    return caixa
  }
}

export { IdSelectCaixaUseCase }
