import { inject, injectable } from "tsyringe"
import { IMeioPagamentoRepository } from '@modules/cadastros/repositories/i-meio-pagamento-repository'
import { HttpResponse } from '@shared/helpers/http'

@injectable()
class IdSelectMeioPagamentoUseCase {
  constructor(@inject('MeioPagamentoRepository')
    private meioPagamentoRepository: IMeioPagamentoRepository
  ) {}

  async execute({ id }): Promise<HttpResponse> {
    const meioPagamento = await this.meioPagamentoRepository.idSelect(id)

    return meioPagamento
  }
}

export { IdSelectMeioPagamentoUseCase }
