import { inject, injectable } from 'tsyringe'
import { Fechamento } from '@modules/financeiro/infra/typeorm/entities/fechamento'
import { IFechamentoRepository } from '@modules/financeiro/repositories/i-fechamento-repository'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  search: string,
  filter?: string
}

@injectable()
class CountFechamentoUseCase {
  constructor(@inject('FechamentoRepository')
    private fechamentoRepository: IFechamentoRepository
  ) {}

  async execute({
    search,
    filter
  }: IRequest): Promise<HttpResponse> {
    const fechamentosCount = await this.fechamentoRepository.count(
      search,
      filter
    )

    return fechamentosCount
  }
}

export { CountFechamentoUseCase }
