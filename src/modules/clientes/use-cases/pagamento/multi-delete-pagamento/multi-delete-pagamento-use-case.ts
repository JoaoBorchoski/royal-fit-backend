import { inject, injectable } from 'tsyringe'
import { IPagamentoRepository } from '@modules/clientes/repositories/i-pagamento-repository';
import { HttpResponse } from '@shared/helpers';

@injectable()
class MultiDeletePagamentoUseCase {
  constructor(@inject('PagamentoRepository')
    private pagamentoRepository: IPagamentoRepository
  ) {}

  async execute(ids: string[]): Promise<HttpResponse> {
    const pagamento = await this.pagamentoRepository.multiDelete(ids)

    return pagamento
  }
}

export { MultiDeletePagamentoUseCase }
