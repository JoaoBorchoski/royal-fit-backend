import { inject, injectable } from "tsyringe"
import { IAlmoxarifadoItemRepository } from '@modules/almoxarifado/repositories/i-almoxarifado-item-repository'
import { HttpResponse } from '@shared/helpers/http'

@injectable()
class IdSelectAlmoxarifadoItemUseCase {
  constructor(@inject('AlmoxarifadoItemRepository')
    private almoxarifadoItemRepository: IAlmoxarifadoItemRepository
  ) {}

  async execute({ id }): Promise<HttpResponse> {
    const almoxarifadoItem = await this.almoxarifadoItemRepository.idSelect(id)

    return almoxarifadoItem
  }
}

export { IdSelectAlmoxarifadoItemUseCase }
