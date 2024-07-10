import { inject, injectable } from "tsyringe"
import { IBalancoRepository } from '@modules/clientes/repositories/i-balanco-repository'
import { HttpResponse } from '@shared/helpers/http'

@injectable()
class IdSelectBalancoUseCase {
  constructor(@inject('BalancoRepository')
    private balancoRepository: IBalancoRepository
  ) {}

  async execute({ id }): Promise<HttpResponse> {
    const balanco = await this.balancoRepository.idSelect(id)

    return balanco
  }
}

export { IdSelectBalancoUseCase }
