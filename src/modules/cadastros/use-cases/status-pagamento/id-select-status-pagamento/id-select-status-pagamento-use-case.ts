import { inject, injectable } from "tsyringe"
import { IStatusPagamentoRepository } from '@modules/cadastros/repositories/i-status-pagamento-repository'
import { HttpResponse } from '@shared/helpers/http'

@injectable()
class IdSelectStatusPagamentoUseCase {
  constructor(@inject('StatusPagamentoRepository')
    private statusPagamentoRepository: IStatusPagamentoRepository
  ) {}

  async execute({ id }): Promise<HttpResponse> {
    const statusPagamento = await this.statusPagamentoRepository.idSelect(id)

    return statusPagamento
  }
}

export { IdSelectStatusPagamentoUseCase }
