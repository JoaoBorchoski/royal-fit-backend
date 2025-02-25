import { inject, injectable } from 'tsyringe'
import { IFechamentoRepository } from '@modules/financeiro/repositories/i-fechamento-repository';
import { HttpResponse } from '@shared/helpers';

@injectable()
class MultiDeleteFechamentoUseCase {
  constructor(@inject('FechamentoRepository')
    private fechamentoRepository: IFechamentoRepository
  ) {}

  async execute(ids: string[]): Promise<HttpResponse> {
    const fechamento = await this.fechamentoRepository.multiDelete(ids)

    return fechamento
  }
}

export { MultiDeleteFechamentoUseCase }
