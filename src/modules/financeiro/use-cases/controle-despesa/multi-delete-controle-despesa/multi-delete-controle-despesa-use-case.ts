import { inject, injectable } from "tsyringe"
import { IControleDespesaRepository } from "@modules/financeiro/repositories/i-controle-despesa-repository"
import { HttpResponse } from "@shared/helpers"

@injectable()
class MultiDeleteControleDespesaUseCase {
  constructor(
    @inject("ControleDespesaRepository")
    private controleDespesaRepository: IControleDespesaRepository
  ) {}

  async execute(ids: string[]): Promise<HttpResponse> {
    const controleDespesa = await this.controleDespesaRepository.multiDelete(ids)

    return controleDespesa
  }
}

export { MultiDeleteControleDespesaUseCase }
