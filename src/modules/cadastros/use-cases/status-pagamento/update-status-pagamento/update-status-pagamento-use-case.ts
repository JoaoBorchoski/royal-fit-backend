import { inject, injectable } from 'tsyringe'
import { StatusPagamento } from '@modules/cadastros/infra/typeorm/entities/status-pagamento'
import { IStatusPagamentoRepository } from '@modules/cadastros/repositories/i-status-pagamento-repository'
import { AppError } from '@shared/errors/app-error'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  id: string
  nome: string
  descricao: string
  desabilitado: boolean
}

@injectable()
class UpdateStatusPagamentoUseCase {
  constructor(@inject('StatusPagamentoRepository')
    private statusPagamentoRepository: IStatusPagamentoRepository
  ) {}

  async execute({
    id,
    nome,
    descricao,
    desabilitado
  }: IRequest): Promise<HttpResponse> {
    const statusPagamento = await this.statusPagamentoRepository.update({
      id,
      nome,
      descricao,
      desabilitado
    })

    return statusPagamento
  }
}

export { UpdateStatusPagamentoUseCase }
