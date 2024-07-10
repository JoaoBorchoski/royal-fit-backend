import { inject, injectable } from 'tsyringe'
import { Balanco } from '@modules/clientes/infra/typeorm/entities/balanco'
import { IBalancoRepository } from '@modules/clientes/repositories/i-balanco-repository'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  search: string,
  filter?: string
}

@injectable()
class CountBalancoUseCase {
  constructor(@inject('BalancoRepository')
    private balancoRepository: IBalancoRepository
  ) {}

  async execute({
    search,
    filter
  }: IRequest): Promise<HttpResponse> {
    const balancosCount = await this.balancoRepository.count(
      search,
      filter
    )

    return balancosCount
  }
}

export { CountBalancoUseCase }
