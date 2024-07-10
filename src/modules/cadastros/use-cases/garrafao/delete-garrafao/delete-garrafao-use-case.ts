import { inject, injectable } from 'tsyringe'
import { Garrafao } from '@modules/cadastros/infra/typeorm/entities/garrafao'
import { IGarrafaoRepository } from '@modules/cadastros/repositories/i-garrafao-repository'
import { HttpResponse } from '@shared/helpers'

@injectable()
class DeleteGarrafaoUseCase {
  constructor(@inject('GarrafaoRepository')
    private garrafaoRepository: IGarrafaoRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const garrafao = await this.garrafaoRepository.delete(id)

    return garrafao
  }
}

export { DeleteGarrafaoUseCase }
