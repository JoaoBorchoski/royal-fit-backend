import { inject, injectable } from 'tsyringe'
import { IStatusPagamentoRepository } from '@modules/cadastros/repositories/i-status-pagamento-repository';
import { HttpResponse } from '@shared/helpers';

@injectable()
class MultiDeleteStatusPagamentoUseCase {
  constructor(@inject('StatusPagamentoRepository')
    private statusPagamentoRepository: IStatusPagamentoRepository
  ) {}

  async execute(ids: string[]): Promise<HttpResponse> {
    const statusPagamento = await this.statusPagamentoRepository.multiDelete(ids)

    return statusPagamento
  }
}

export { MultiDeleteStatusPagamentoUseCase }
