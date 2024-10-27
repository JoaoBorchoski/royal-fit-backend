import { IEntradaGarrafaoRepository } from "@modules/cadastros/repositories/i-entrada-garrafao-repository"
import { inject, injectable } from "tsyringe"

interface ResponseProps {
  items?: object[]
  hasNext?: boolean
  value?: string
  label?: string
  clienteId?: string
}

@injectable()
class SelectEntradaGarrafaoUseCase {
  constructor(
    @inject("EntradaGarrafaoRepository")
    private entradaGarrafaoRepository: IEntradaGarrafaoRepository
  ) {}

  async execute({ filter, clienteId }): Promise<ResponseProps> {
    const entradasGarrafao = await this.entradaGarrafaoRepository.select(filter, clienteId)

    const newEntradasGarrafao = {
      items: entradasGarrafao.data,
      hasNext: false,
    }

    return newEntradasGarrafao
  }
}

export { SelectEntradaGarrafaoUseCase }
