import { inject, injectable } from 'tsyringe'
import { Pagamento } from '@modules/clientes/infra/typeorm/entities/pagamento'
import { IPagamentoRepository } from '@modules/clientes/repositories/i-pagamento-repository'
import { AppError } from '@shared/errors/app-error'

interface IRequest {
  clienteId: string
  valorPago: number
  meioPagamentoId: string
  desabilitado: boolean
}

@injectable()
class CreatePagamentoUseCase {
  constructor(@inject('PagamentoRepository')
    private pagamentoRepository: IPagamentoRepository
  ) {}

  async execute({
    clienteId,
    valorPago,
    meioPagamentoId,
    desabilitado
  }: IRequest): Promise<Pagamento> {
    const result = await this.pagamentoRepository.create({
        clienteId,
        valorPago,
        meioPagamentoId,
        desabilitado
      })
      .then(pagamentoResult => {
        return pagamentoResult
      })
      .catch(error => {
        return error
      })

    return result
  }
}

export { CreatePagamentoUseCase }
