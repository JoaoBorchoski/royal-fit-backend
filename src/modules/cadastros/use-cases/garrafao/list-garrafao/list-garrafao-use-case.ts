import { inject, injectable } from 'tsyringe'
import { IGarrafaoRepository } from '@modules/cadastros/repositories/i-garrafao-repository'
import { IGarrafaoDTO } from '@modules/cadastros/dtos/i-garrafao-dto';

interface IRequest {
  search: string,
  page: number,
  rowsPerPage: number,
  order: string,
  filter?: string
}

interface ResponseProps {
  items: IGarrafaoDTO[],
  hasNext: boolean
}

@injectable()
class ListGarrafaoUseCase {
  constructor(@inject('GarrafaoRepository')
    private garrafaoRepository: IGarrafaoRepository
  ) {}

  async execute({
    search = '',
    page = 0,
    rowsPerPage = 50,
    order = '',
    filter
  }: IRequest): Promise<ResponseProps> {
    const newPage = page !== 0 ? page - 1 : 0

    const garrafoes = await this.garrafaoRepository.list(
      search,
      newPage,
      rowsPerPage,
      order,
      filter
    )

    const countGarrafoes = await this.garrafaoRepository.count(
      search,
      filter
    )

    const numeroGarrafao = page * rowsPerPage

    const garrafoesResponse = {
      items: garrafoes.data,
      hasNext: numeroGarrafao < countGarrafoes.data.count
    }

    return garrafoesResponse
  }
}

export { ListGarrafaoUseCase }
