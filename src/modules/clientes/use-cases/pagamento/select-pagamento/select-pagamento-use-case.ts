import { inject, injectable } from 'tsyringe'
import { IPagamentoRepository } from '@modules/clientes/repositories/i-pagamento-repository'

interface ResponseProps {
  items?: object[]
  hasNext?: boolean
  value?: string
  label?: string
}

@injectable()
class SelectPagamentoUseCase {
  constructor(@inject('PagamentoRepository')
    private pagamentoRepository: IPagamentoRepository
  ) {}

  async execute({
    filter,
  }): Promise<ResponseProps> {
    const pagamentos = await this.pagamentoRepository.select(filter)

    const newPagamentos = {
      items: pagamentos.data,
      hasNext: false
    }

    return newPagamentos
  }
}

export { SelectPagamentoUseCase }
