import { inject, injectable } from "tsyringe"

import { HttpResponse } from "@shared/helpers"
import { IEntradaGarrafaoRepository } from "@modules/cadastros/repositories/i-entrada-garrafao-repository"

@injectable()
class DeleteEntradaGarrafaoUseCase {
  constructor(
    @inject("EntradaGarrafaoRepository")
    private entradaGarrafaoRepository: IEntradaGarrafaoRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const entradaGarrafao = await this.entradaGarrafaoRepository.delete(id)

    return entradaGarrafao
  }
}

export { DeleteEntradaGarrafaoUseCase }
