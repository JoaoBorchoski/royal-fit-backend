import { inject, injectable } from 'tsyringe'
import { AlmoxarifadoItem } from '@modules/almoxarifado/infra/typeorm/entities/almoxarifado-item'
import { IAlmoxarifadoItemRepository } from '@modules/almoxarifado/repositories/i-almoxarifado-item-repository'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  search: string,
  filter?: string
}

@injectable()
class CountAlmoxarifadoItemUseCase {
  constructor(@inject('AlmoxarifadoItemRepository')
    private almoxarifadoItemRepository: IAlmoxarifadoItemRepository
  ) {}

  async execute({
    search,
    filter
  }: IRequest): Promise<HttpResponse> {
    const almoxarifadoItensCount = await this.almoxarifadoItemRepository.count(
      search,
      filter
    )

    return almoxarifadoItensCount
  }
}

export { CountAlmoxarifadoItemUseCase }
