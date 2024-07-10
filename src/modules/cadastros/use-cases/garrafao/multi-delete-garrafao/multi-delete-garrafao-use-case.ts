import { inject, injectable } from 'tsyringe'
import { IGarrafaoRepository } from '@modules/cadastros/repositories/i-garrafao-repository';
import { HttpResponse } from '@shared/helpers';

@injectable()
class MultiDeleteGarrafaoUseCase {
  constructor(@inject('GarrafaoRepository')
    private garrafaoRepository: IGarrafaoRepository
  ) {}

  async execute(ids: string[]): Promise<HttpResponse> {
    const garrafao = await this.garrafaoRepository.multiDelete(ids)

    return garrafao
  }
}

export { MultiDeleteGarrafaoUseCase }
