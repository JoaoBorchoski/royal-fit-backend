import { inject, injectable } from "tsyringe"
import { IControleDespesaRepository } from "@modules/financeiro/repositories/i-controle-despesa-repository"

interface ResponseProps {
  items?: object[]
  hasNext?: boolean
  value?: string
  label?: string
}

@injectable()
class SelectControleDespesaUseCase {
  constructor(
    @inject("ControleDespesaRepository")
    private controleDespesaRepository: IControleDespesaRepository
  ) {}

  async execute({ filter }): Promise<ResponseProps> {
    const controleDespesas = await this.controleDespesaRepository.select(filter)

    const newControleDespesas = {
      items: controleDespesas.data,
      hasNext: false,
    }

    return newControleDespesas
  }
}

export { SelectControleDespesaUseCase }
