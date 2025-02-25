import { inject, injectable } from "tsyringe"
import { Fechamento } from "@modules/financeiro/infra/typeorm/entities/fechamento"
import { IFechamentoRepository } from "@modules/financeiro/repositories/i-fechamento-repository"
import { HttpResponse, ok } from "@shared/helpers"

@injectable()
class GetFechamentoDataUseCase {
  constructor(
    @inject("FechamentoRepository")
    private fechamentoRepository: IFechamentoRepository
  ) {}

  async execute(): Promise<HttpResponse> {
    try {
      const fechamento = await this.fechamentoRepository.getData()

      return fechamento
    } catch (error) {
      return error
    }
  }
}

export { GetFechamentoDataUseCase }
