import { inject, injectable } from 'tsyringe'
import { IAlmoxarifadoItemRepository } from '@modules/almoxarifado/repositories/i-almoxarifado-item-repository';
import { HttpResponse } from '@shared/helpers';

@injectable()
class MultiDeleteAlmoxarifadoItemUseCase {
  constructor(@inject('AlmoxarifadoItemRepository')
    private almoxarifadoItemRepository: IAlmoxarifadoItemRepository
  ) {}

  async execute(ids: string[]): Promise<HttpResponse> {
    const almoxarifadoItem = await this.almoxarifadoItemRepository.multiDelete(ids)

    return almoxarifadoItem
  }
}

export { MultiDeleteAlmoxarifadoItemUseCase }
