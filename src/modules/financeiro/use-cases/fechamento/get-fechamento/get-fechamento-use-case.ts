import { inject, injectable } from 'tsyringe'
import { Fechamento } from '@modules/financeiro/infra/typeorm/entities/fechamento'
import { IFechamentoRepository } from '@modules/financeiro/repositories/i-fechamento-repository'
import { HttpResponse } from '@shared/helpers'

@injectable()
class GetFechamentoUseCase {
  constructor(@inject('FechamentoRepository')
    private fechamentoRepository: IFechamentoRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const fechamento = await this.fechamentoRepository.get(id)

    return fechamento
  }
}

export { GetFechamentoUseCase }
