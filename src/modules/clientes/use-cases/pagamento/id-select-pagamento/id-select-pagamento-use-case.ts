import { inject, injectable } from "tsyringe"
import { IPagamentoRepository } from '@modules/clientes/repositories/i-pagamento-repository'
import { HttpResponse } from '@shared/helpers/http'

@injectable()
class IdSelectPagamentoUseCase {
  constructor(@inject('PagamentoRepository')
    private pagamentoRepository: IPagamentoRepository
  ) {}

  async execute({ id }): Promise<HttpResponse> {
    const pagamento = await this.pagamentoRepository.idSelect(id)

    return pagamento
  }
}

export { IdSelectPagamentoUseCase }
