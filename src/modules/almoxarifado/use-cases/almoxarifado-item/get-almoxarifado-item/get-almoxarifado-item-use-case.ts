import { inject, injectable } from 'tsyringe'
import { AlmoxarifadoItem } from '@modules/almoxarifado/infra/typeorm/entities/almoxarifado-item'
import { IAlmoxarifadoItemRepository } from '@modules/almoxarifado/repositories/i-almoxarifado-item-repository'
import { HttpResponse } from '@shared/helpers'

@injectable()
class GetAlmoxarifadoItemUseCase {
  constructor(@inject('AlmoxarifadoItemRepository')
    private almoxarifadoItemRepository: IAlmoxarifadoItemRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const almoxarifadoItem = await this.almoxarifadoItemRepository.get(id)

    return almoxarifadoItem
  }
}

export { GetAlmoxarifadoItemUseCase }
