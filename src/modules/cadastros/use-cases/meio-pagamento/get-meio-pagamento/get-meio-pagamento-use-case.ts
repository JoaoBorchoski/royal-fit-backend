import { inject, injectable } from 'tsyringe'
import { MeioPagamento } from '@modules/cadastros/infra/typeorm/entities/meio-pagamento'
import { IMeioPagamentoRepository } from '@modules/cadastros/repositories/i-meio-pagamento-repository'
import { HttpResponse } from '@shared/helpers'

@injectable()
class GetMeioPagamentoUseCase {
  constructor(@inject('MeioPagamentoRepository')
    private meioPagamentoRepository: IMeioPagamentoRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const meioPagamento = await this.meioPagamentoRepository.get(id)

    return meioPagamento
  }
}

export { GetMeioPagamentoUseCase }
