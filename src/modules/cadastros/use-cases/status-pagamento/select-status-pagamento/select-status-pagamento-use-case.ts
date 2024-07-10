import { inject, injectable } from 'tsyringe'
import { IStatusPagamentoRepository } from '@modules/cadastros/repositories/i-status-pagamento-repository'

interface ResponseProps {
  items?: object[]
  hasNext?: boolean
  value?: string
  label?: string
}

@injectable()
class SelectStatusPagamentoUseCase {
  constructor(@inject('StatusPagamentoRepository')
    private statusPagamentoRepository: IStatusPagamentoRepository
  ) {}

  async execute({
    filter,
  }): Promise<ResponseProps> {
    const statusPagamento = await this.statusPagamentoRepository.select(filter)

    const newStatusPagamento = {
      items: statusPagamento.data,
      hasNext: false
    }

    return newStatusPagamento
  }
}

export { SelectStatusPagamentoUseCase }
