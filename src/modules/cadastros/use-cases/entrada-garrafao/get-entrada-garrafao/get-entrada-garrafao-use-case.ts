import { inject, injectable } from "tsyringe"
import { HttpResponse } from "@shared/helpers"
import { IEntradaGarrafaoRepository } from "@modules/cadastros/repositories/i-entrada-garrafao-repository"

@injectable()
class GetEntradaGarrafaoUseCase {
  constructor(
    @inject("EntradaGarrafaoRepository")
    private entradaGarrafaoRepository: IEntradaGarrafaoRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const entradaGarrafao = await this.entradaGarrafaoRepository.get(id)

    return entradaGarrafao
  }
}

export { GetEntradaGarrafaoUseCase }
