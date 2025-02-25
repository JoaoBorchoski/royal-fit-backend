import { inject, injectable } from 'tsyringe'
import { Caixa } from '@modules/financeiro/infra/typeorm/entities/caixa'
import { ICaixaRepository } from '@modules/financeiro/repositories/i-caixa-repository'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  search: string,
  filter?: string
}

@injectable()
class CountCaixaUseCase {
  constructor(@inject('CaixaRepository')
    private caixaRepository: ICaixaRepository
  ) {}

  async execute({
    search,
    filter
  }: IRequest): Promise<HttpResponse> {
    const caixasCount = await this.caixaRepository.count(
      search,
      filter
    )

    return caixasCount
  }
}

export { CountCaixaUseCase }
