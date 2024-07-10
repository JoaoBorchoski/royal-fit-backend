import { inject, injectable } from 'tsyringe'
import { Balanco } from '@modules/clientes/infra/typeorm/entities/balanco'
import { IBalancoRepository } from '@modules/clientes/repositories/i-balanco-repository'
import { HttpResponse } from '@shared/helpers'

@injectable()
class GetBalancoUseCase {
  constructor(@inject('BalancoRepository')
    private balancoRepository: IBalancoRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const balanco = await this.balancoRepository.get(id)

    return balanco
  }
}

export { GetBalancoUseCase }
