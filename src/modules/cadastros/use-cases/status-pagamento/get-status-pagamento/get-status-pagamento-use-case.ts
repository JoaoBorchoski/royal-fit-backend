import { inject, injectable } from 'tsyringe'
import { StatusPagamento } from '@modules/cadastros/infra/typeorm/entities/status-pagamento'
import { IStatusPagamentoRepository } from '@modules/cadastros/repositories/i-status-pagamento-repository'
import { HttpResponse } from '@shared/helpers'

@injectable()
class GetStatusPagamentoUseCase {
  constructor(@inject('StatusPagamentoRepository')
    private statusPagamentoRepository: IStatusPagamentoRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const statusPagamento = await this.statusPagamentoRepository.get(id)

    return statusPagamento
  }
}

export { GetStatusPagamentoUseCase }
