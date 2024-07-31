import { inject, injectable } from 'tsyringe'
import { IAlmoxarifadoItemRepository } from '@modules/almoxarifado/repositories/i-almoxarifado-item-repository'

interface ResponseProps {
  items?: object[]
  hasNext?: boolean
  value?: string
  label?: string
}

@injectable()
class SelectAlmoxarifadoItemUseCase {
  constructor(@inject('AlmoxarifadoItemRepository')
    private almoxarifadoItemRepository: IAlmoxarifadoItemRepository
  ) {}

  async execute({
    filter,
  }): Promise<ResponseProps> {
    const almoxarifadoItens = await this.almoxarifadoItemRepository.select(filter)

    const newAlmoxarifadoItens = {
      items: almoxarifadoItens.data,
      hasNext: false
    }

    return newAlmoxarifadoItens
  }
}

export { SelectAlmoxarifadoItemUseCase }
