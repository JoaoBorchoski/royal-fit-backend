import { inject, injectable } from 'tsyringe'
import { Fechamento } from '@modules/financeiro/infra/typeorm/entities/fechamento'
import { IFechamentoRepository } from '@modules/financeiro/repositories/i-fechamento-repository'
import { AppError } from '@shared/errors/app-error'

interface IRequest {
  data: Date
  saldoInicial: number
  saldoFinal: number
  saldoEntradas: number
  valorTotal: number
}

@injectable()
class CreateFechamentoUseCase {
  constructor(@inject('FechamentoRepository')
    private fechamentoRepository: IFechamentoRepository
  ) {}

  async execute({
    data,
    saldoInicial,
    saldoFinal,
    saldoEntradas,
    valorTotal
  }: IRequest): Promise<Fechamento> {
    const result = await this.fechamentoRepository.create({
        data,
        saldoInicial,
        saldoFinal,
        saldoEntradas,
        valorTotal
      })
      .then(fechamentoResult => {
        return fechamentoResult
      })
      .catch(error => {
        return error
      })

    return result
  }
}

export { CreateFechamentoUseCase }
