import { inject, injectable } from "tsyringe"
import { HttpResponse } from "@shared/helpers/http"
import { IEntradaGarrafaoRepository } from "@modules/cadastros/repositories/i-entrada-garrafao-repository"

@injectable()
class IdSelectEntradaGarrafaoUseCase {
  constructor(
    @inject("EntradaGarrafaoRepository")
    private entradaGarrafaoRepository: IEntradaGarrafaoRepository
  ) {}

  async execute({ id }): Promise<HttpResponse> {
    const entradaGarrafao = await this.entradaGarrafaoRepository.idSelect(id)

    return entradaGarrafao
  }
}

export { IdSelectEntradaGarrafaoUseCase }
