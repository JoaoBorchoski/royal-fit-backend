import { inject, injectable } from "tsyringe"

import { HttpResponse } from "@shared/helpers"
import { IEntradaGarrafaoRepository } from "@modules/cadastros/repositories/i-entrada-garrafao-repository"

interface IRequest {
  search: string
  filter?: string
}

@injectable()
class CountEntradaGarrafaoUseCase {
  constructor(
    @inject("EntradaGarrafaoRepository")
    private entradaGarrafaoRepository: IEntradaGarrafaoRepository
  ) {}

  async execute({ search, filter }: IRequest): Promise<HttpResponse> {
    const entradasGarrafaoCount = await this.entradaGarrafaoRepository.count(search, filter)

    return entradasGarrafaoCount
  }
}

export { CountEntradaGarrafaoUseCase }
