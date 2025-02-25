import { inject, injectable } from "tsyringe"
import { IFechamentoRepository } from '@modules/financeiro/repositories/i-fechamento-repository'
import { HttpResponse } from '@shared/helpers/http'

@injectable()
class IdSelectFechamentoUseCase {
  constructor(@inject('FechamentoRepository')
    private fechamentoRepository: IFechamentoRepository
  ) {}

  async execute({ id }): Promise<HttpResponse> {
    const fechamento = await this.fechamentoRepository.idSelect(id)

    return fechamento
  }
}

export { IdSelectFechamentoUseCase }
