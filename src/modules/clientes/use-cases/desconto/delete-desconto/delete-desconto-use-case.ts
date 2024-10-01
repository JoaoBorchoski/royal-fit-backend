import { inject, injectable } from 'tsyringe'
import { Desconto } from '@modules/clientes/infra/typeorm/entities/desconto'
import { IDescontoRepository } from '@modules/clientes/repositories/i-desconto-repository'
import { HttpResponse } from '@shared/helpers'

@injectable()
class DeleteDescontoUseCase {
  constructor(@inject('DescontoRepository')
    private descontoRepository: IDescontoRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const desconto = await this.descontoRepository.delete(id)

    return desconto
  }
}

export { DeleteDescontoUseCase }
