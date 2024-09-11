import { inject, injectable } from "tsyringe"
import { HttpResponse } from "@shared/helpers"
import { IEntradaGarrafaoRepository } from "@modules/cadastros/repositories/i-entrada-garrafao-repository"

@injectable()
class MultiDeleteEntradaGarrafaoUseCase {
  constructor(
    @inject("EntradaGarrafaoRepository")
    private entradaGarrafaoRepository: IEntradaGarrafaoRepository
  ) {}

  async execute(ids: string[]): Promise<HttpResponse> {
    const entradaGarrafao = await this.entradaGarrafaoRepository.multiDelete(ids)

    return entradaGarrafao
  }
}

export { MultiDeleteEntradaGarrafaoUseCase }
