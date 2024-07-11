import { inject, injectable } from "tsyringe"
import { IMeioPagamentoRepository } from "@modules/cadastros/repositories/i-meio-pagamento-repository"

interface ResponseProps {
  items?: object[]
  hasNext?: boolean
  value?: string
  label?: string
}

@injectable()
class SelectMeioPagamentoUseCase {
  constructor(
    @inject("MeioPagamentoRepository")
    private meioPagamentoRepository: IMeioPagamentoRepository
  ) {}

  async execute({ filter }): Promise<ResponseProps> {
    const meiosPagamento = await this.meioPagamentoRepository.select(filter)

    const newMeiosPagamento = {
      items: meiosPagamento.data,
      hasNext: false,
    }

    return newMeiosPagamento
  }
}

export { SelectMeioPagamentoUseCase }
