import { inject, injectable } from 'tsyringe'
import { ICaixaRepository } from '@modules/financeiro/repositories/i-caixa-repository';
import { HttpResponse } from '@shared/helpers';

@injectable()
class MultiDeleteCaixaUseCase {
  constructor(@inject('CaixaRepository')
    private caixaRepository: ICaixaRepository
  ) {}

  async execute(ids: string[]): Promise<HttpResponse> {
    const caixa = await this.caixaRepository.multiDelete(ids)

    return caixa
  }
}

export { MultiDeleteCaixaUseCase }
