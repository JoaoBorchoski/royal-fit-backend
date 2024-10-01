import { inject, injectable } from "tsyringe"
import { IDescontoRepository } from '@modules/clientes/repositories/i-desconto-repository'
import { HttpResponse } from '@shared/helpers/http'

@injectable()
class IdSelectDescontoUseCase {
  constructor(@inject('DescontoRepository')
    private descontoRepository: IDescontoRepository
  ) {}

  async execute({ id }): Promise<HttpResponse> {
    const desconto = await this.descontoRepository.idSelect(id)

    return desconto
  }
}

export { IdSelectDescontoUseCase }
