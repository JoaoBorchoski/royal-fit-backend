import { inject, injectable } from 'tsyringe'
import { Fechamento } from '@modules/financeiro/infra/typeorm/entities/fechamento'
import { IFechamentoRepository } from '@modules/financeiro/repositories/i-fechamento-repository'
import { AppError } from '@shared/errors/app-error'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  id: string
  data: Date
  saldoInicial: number
  saldoFinal: number
  saldoEntradas: number
  valorTotal: number
}

@injectable()
class UpdateFechamentoUseCase {
  constructor(@inject('FechamentoRepository')
    private fechamentoRepository: IFechamentoRepository
  ) {}

  async execute({
    id,
    data,
    saldoInicial,
    saldoFinal,
    saldoEntradas,
    valorTotal
  }: IRequest): Promise<HttpResponse> {
    const fechamento = await this.fechamentoRepository.update({
      id,
      data,
      saldoInicial,
      saldoFinal,
      saldoEntradas,
      valorTotal
    })

    return fechamento
  }
}

export { UpdateFechamentoUseCase }
