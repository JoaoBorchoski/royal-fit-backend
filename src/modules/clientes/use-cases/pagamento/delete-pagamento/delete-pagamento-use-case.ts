import { inject, injectable } from 'tsyringe'
import { Pagamento } from '@modules/clientes/infra/typeorm/entities/pagamento'
import { IPagamentoRepository } from '@modules/clientes/repositories/i-pagamento-repository'
import { HttpResponse } from '@shared/helpers'

@injectable()
class DeletePagamentoUseCase {
  constructor(@inject('PagamentoRepository')
    private pagamentoRepository: IPagamentoRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const pagamento = await this.pagamentoRepository.delete(id)

    return pagamento
  }
}

export { DeletePagamentoUseCase }
