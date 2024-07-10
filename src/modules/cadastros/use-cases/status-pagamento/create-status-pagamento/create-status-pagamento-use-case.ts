import { inject, injectable } from 'tsyringe'
import { StatusPagamento } from '@modules/cadastros/infra/typeorm/entities/status-pagamento'
import { IStatusPagamentoRepository } from '@modules/cadastros/repositories/i-status-pagamento-repository'
import { AppError } from '@shared/errors/app-error'

interface IRequest {
  nome: string
  descricao: string
  desabilitado: boolean
}

@injectable()
class CreateStatusPagamentoUseCase {
  constructor(@inject('StatusPagamentoRepository')
    private statusPagamentoRepository: IStatusPagamentoRepository
  ) {}

  async execute({
    nome,
    descricao,
    desabilitado
  }: IRequest): Promise<StatusPagamento> {
    const result = await this.statusPagamentoRepository.create({
        nome,
        descricao,
        desabilitado
      })
      .then(statusPagamentoResult => {
        return statusPagamentoResult
      })
      .catch(error => {
        return error
      })

    return result
  }
}

export { CreateStatusPagamentoUseCase }
