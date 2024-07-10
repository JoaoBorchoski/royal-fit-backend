import { inject, injectable } from 'tsyringe'
import { Pagamento } from '@modules/clientes/infra/typeorm/entities/pagamento'
import { IPagamentoRepository } from '@modules/clientes/repositories/i-pagamento-repository'
import { AppError } from '@shared/errors/app-error'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  id: string
  clienteId: string
  valorPago: number
  meioPagamentoId: string
  desabilitado: boolean
}

@injectable()
class UpdatePagamentoUseCase {
  constructor(@inject('PagamentoRepository')
    private pagamentoRepository: IPagamentoRepository
  ) {}

  async execute({
    id,
    clienteId,
    valorPago,
    meioPagamentoId,
    desabilitado
  }: IRequest): Promise<HttpResponse> {
    const pagamento = await this.pagamentoRepository.update({
      id,
      clienteId,
      valorPago,
      meioPagamentoId,
      desabilitado
    })

    return pagamento
  }
}

export { UpdatePagamentoUseCase }
