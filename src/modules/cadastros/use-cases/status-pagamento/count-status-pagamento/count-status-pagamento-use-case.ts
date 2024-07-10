import { inject, injectable } from 'tsyringe'
import { StatusPagamento } from '@modules/cadastros/infra/typeorm/entities/status-pagamento'
import { IStatusPagamentoRepository } from '@modules/cadastros/repositories/i-status-pagamento-repository'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  search: string,
  filter?: string
}

@injectable()
class CountStatusPagamentoUseCase {
  constructor(@inject('StatusPagamentoRepository')
    private statusPagamentoRepository: IStatusPagamentoRepository
  ) {}

  async execute({
    search,
    filter
  }: IRequest): Promise<HttpResponse> {
    const statusPagamentoCount = await this.statusPagamentoRepository.count(
      search,
      filter
    )

    return statusPagamentoCount
  }
}

export { CountStatusPagamentoUseCase }
