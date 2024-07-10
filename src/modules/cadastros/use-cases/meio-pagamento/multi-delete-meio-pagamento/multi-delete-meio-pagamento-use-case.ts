import { inject, injectable } from 'tsyringe'
import { IMeioPagamentoRepository } from '@modules/cadastros/repositories/i-meio-pagamento-repository';
import { HttpResponse } from '@shared/helpers';

@injectable()
class MultiDeleteMeioPagamentoUseCase {
  constructor(@inject('MeioPagamentoRepository')
    private meioPagamentoRepository: IMeioPagamentoRepository
  ) {}

  async execute(ids: string[]): Promise<HttpResponse> {
    const meioPagamento = await this.meioPagamentoRepository.multiDelete(ids)

    return meioPagamento
  }
}

export { MultiDeleteMeioPagamentoUseCase }
