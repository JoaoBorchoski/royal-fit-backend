import { inject, injectable } from 'tsyringe'
import { IGarrafaoRepository } from '@modules/cadastros/repositories/i-garrafao-repository'

interface ResponseProps {
  items?: object[]
  hasNext?: boolean
  value?: string
  label?: string
}

@injectable()
class SelectGarrafaoUseCase {
  constructor(@inject('GarrafaoRepository')
    private garrafaoRepository: IGarrafaoRepository
  ) {}

  async execute({
    filter,
  }): Promise<ResponseProps> {
    const garrafoes = await this.garrafaoRepository.select(filter)

    const newGarrafoes = {
      items: garrafoes.data,
      hasNext: false
    }

    return newGarrafoes
  }
}

export { SelectGarrafaoUseCase }
