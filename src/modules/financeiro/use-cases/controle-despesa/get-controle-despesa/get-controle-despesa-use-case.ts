import { inject, injectable } from "tsyringe"
import { ControleDespesa } from "@modules/financeiro/infra/typeorm/entities/controle-despesa"
import { IControleDespesaRepository } from "@modules/financeiro/repositories/i-controle-despesa-repository"
import { HttpResponse } from "@shared/helpers"

@injectable()
class GetControleDespesaUseCase {
  constructor(
    @inject("ControleDespesaRepository")
    private controleDespesaRepository: IControleDespesaRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const controleDespesa = await this.controleDespesaRepository.get(id)

    return controleDespesa
  }
}

export { GetControleDespesaUseCase }
