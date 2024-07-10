import { inject, injectable } from 'tsyringe'
import { IBonificacaoRepository } from '@modules/cadastros/repositories/i-bonificacao-repository'
import { IBonificacaoDTO } from '@modules/cadastros/dtos/i-bonificacao-dto';

interface IRequest {
  search: string,
  page: number,
  rowsPerPage: number,
  order: string,
  filter?: string
}

interface ResponseProps {
  items: IBonificacaoDTO[],
  hasNext: boolean
}

@injectable()
class ListBonificacaoUseCase {
  constructor(@inject('BonificacaoRepository')
    private bonificacaoRepository: IBonificacaoRepository
  ) {}

  async execute({
    search = '',
    page = 0,
    rowsPerPage = 50,
    order = '',
    filter
  }: IRequest): Promise<ResponseProps> {
    const newPage = page !== 0 ? page - 1 : 0

    const bonificacoes = await this.bonificacaoRepository.list(
      search,
      newPage,
      rowsPerPage,
      order,
      filter
    )

    const countBonificacoes = await this.bonificacaoRepository.count(
      search,
      filter
    )

    const numeroBonificacao = page * rowsPerPage

    const bonificacoesResponse = {
      items: bonificacoes.data,
      hasNext: numeroBonificacao < countBonificacoes.data.count
    }

    return bonificacoesResponse
  }
}

export { ListBonificacaoUseCase }
