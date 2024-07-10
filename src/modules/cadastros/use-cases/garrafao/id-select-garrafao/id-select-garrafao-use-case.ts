import { inject, injectable } from "tsyringe"
import { IGarrafaoRepository } from '@modules/cadastros/repositories/i-garrafao-repository'
import { HttpResponse } from '@shared/helpers/http'

@injectable()
class IdSelectGarrafaoUseCase {
  constructor(@inject('GarrafaoRepository')
    private garrafaoRepository: IGarrafaoRepository
  ) {}

  async execute({ id }): Promise<HttpResponse> {
    const garrafao = await this.garrafaoRepository.idSelect(id)

    return garrafao
  }
}

export { IdSelectGarrafaoUseCase }
