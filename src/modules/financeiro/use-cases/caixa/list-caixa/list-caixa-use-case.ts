import { inject, injectable } from 'tsyringe'
import { ICaixaRepository } from '@modules/financeiro/repositories/i-caixa-repository'
import { ICaixaDTO } from '@modules/financeiro/dtos/i-caixa-dto';

interface IRequest {
  search: string,
  page: number,
  rowsPerPage: number,
  order: string,
  filter?: string
}

interface ResponseProps {
  items: ICaixaDTO[],
  hasNext: boolean
}

@injectable()
class ListCaixaUseCase {
  constructor(@inject('CaixaRepository')
    private caixaRepository: ICaixaRepository
  ) {}

  async execute({
    search = '',
    page = 0,
    rowsPerPage = 50,
    order = '',
    filter
  }: IRequest): Promise<ResponseProps> {
    const newPage = page !== 0 ? page - 1 : 0

    const caixas = await this.caixaRepository.list(
      search,
      newPage,
      rowsPerPage,
      order,
      filter
    )

    const countCaixas = await this.caixaRepository.count(
      search,
      filter
    )

    const numeroCaixa = page * rowsPerPage

    const caixasResponse = {
      items: caixas.data,
      hasNext: numeroCaixa < countCaixas.data.count
    }

    return caixasResponse
  }
}

export { ListCaixaUseCase }
