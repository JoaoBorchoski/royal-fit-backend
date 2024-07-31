import { inject, injectable } from 'tsyringe'
import { IAlmoxarifadoItemRepository } from '@modules/almoxarifado/repositories/i-almoxarifado-item-repository'
import { IAlmoxarifadoItemDTO } from '@modules/almoxarifado/dtos/i-almoxarifado-item-dto';

interface IRequest {
  search: string,
  page: number,
  rowsPerPage: number,
  order: string,
  filter?: string
}

interface ResponseProps {
  items: IAlmoxarifadoItemDTO[],
  hasNext: boolean
}

@injectable()
class ListAlmoxarifadoItemUseCase {
  constructor(@inject('AlmoxarifadoItemRepository')
    private almoxarifadoItemRepository: IAlmoxarifadoItemRepository
  ) {}

  async execute({
    search = '',
    page = 0,
    rowsPerPage = 50,
    order = '',
    filter
  }: IRequest): Promise<ResponseProps> {
    const newPage = page !== 0 ? page - 1 : 0

    const almoxarifadoItens = await this.almoxarifadoItemRepository.list(
      search,
      newPage,
      rowsPerPage,
      order,
      filter
    )

    const countAlmoxarifadoItens = await this.almoxarifadoItemRepository.count(
      search,
      filter
    )

    const numeroAlmoxarifadoItem = page * rowsPerPage

    const almoxarifadoItensResponse = {
      items: almoxarifadoItens.data,
      hasNext: numeroAlmoxarifadoItem < countAlmoxarifadoItens.data.count
    }

    return almoxarifadoItensResponse
  }
}

export { ListAlmoxarifadoItemUseCase }
