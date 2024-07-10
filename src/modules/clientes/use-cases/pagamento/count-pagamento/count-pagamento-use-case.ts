import { inject, injectable } from 'tsyringe'
import { Pagamento } from '@modules/clientes/infra/typeorm/entities/pagamento'
import { IPagamentoRepository } from '@modules/clientes/repositories/i-pagamento-repository'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  search: string,
  filter?: string
}

@injectable()
class CountPagamentoUseCase {
  constructor(@inject('PagamentoRepository')
    private pagamentoRepository: IPagamentoRepository
  ) {}

  async execute({
    search,
    filter
  }: IRequest): Promise<HttpResponse> {
    const pagamentosCount = await this.pagamentoRepository.count(
      search,
      filter
    )

    return pagamentosCount
  }
}

export { CountPagamentoUseCase }
