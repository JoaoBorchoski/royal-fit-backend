import { inject, injectable } from "tsyringe"
import { IControleDespesaRepository } from "@modules/financeiro/repositories/i-controle-despesa-repository"
import { HttpResponse } from "@shared/helpers/http"

@injectable()
class IdSelectControleDespesaUseCase {
  constructor(
    @inject("ControleDespesaRepository")
    private controleDespesaRepository: IControleDespesaRepository
  ) {}

  async execute({ id }): Promise<HttpResponse> {
    const controleDespesa = await this.controleDespesaRepository.idSelect(id)

    return controleDespesa
  }
}

export { IdSelectControleDespesaUseCase }
