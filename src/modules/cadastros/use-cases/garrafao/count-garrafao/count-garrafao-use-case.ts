import { inject, injectable } from 'tsyringe'
import { Garrafao } from '@modules/cadastros/infra/typeorm/entities/garrafao'
import { IGarrafaoRepository } from '@modules/cadastros/repositories/i-garrafao-repository'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  search: string,
  filter?: string
}

@injectable()
class CountGarrafaoUseCase {
  constructor(@inject('GarrafaoRepository')
    private garrafaoRepository: IGarrafaoRepository
  ) {}

  async execute({
    search,
    filter
  }: IRequest): Promise<HttpResponse> {
    const garrafoesCount = await this.garrafaoRepository.count(
      search,
      filter
    )

    return garrafoesCount
  }
}

export { CountGarrafaoUseCase }
