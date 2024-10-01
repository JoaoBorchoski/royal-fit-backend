import { inject, injectable } from 'tsyringe'
import { Desconto } from '@modules/clientes/infra/typeorm/entities/desconto'
import { IDescontoRepository } from '@modules/clientes/repositories/i-desconto-repository'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  search: string,
  filter?: string
}

@injectable()
class CountDescontoUseCase {
  constructor(@inject('DescontoRepository')
    private descontoRepository: IDescontoRepository
  ) {}

  async execute({
    search,
    filter
  }: IRequest): Promise<HttpResponse> {
    const descontosCount = await this.descontoRepository.count(
      search,
      filter
    )

    return descontosCount
  }
}

export { CountDescontoUseCase }
