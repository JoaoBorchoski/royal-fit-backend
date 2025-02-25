import { inject, injectable } from "tsyringe"
import { ControleDespesa } from "@modules/financeiro/infra/typeorm/entities/controle-despesa"
import { IControleDespesaRepository } from "@modules/financeiro/repositories/i-controle-despesa-repository"
import { HttpResponse } from "@shared/helpers"

interface IRequest {
  search: string
  filter?: string
}

@injectable()
class CountControleDespesaUseCase {
  constructor(
    @inject("ControleDespesaRepository")
    private controleDespesaRepository: IControleDespesaRepository
  ) {}

  async execute({ search, filter }: IRequest): Promise<HttpResponse> {
    const controleDespesasCount = await this.controleDespesaRepository.count(search, filter)

    return controleDespesasCount
  }
}

export { CountControleDespesaUseCase }
