import { inject, injectable } from 'tsyringe'
import { IDescontoRepository } from '@modules/clientes/repositories/i-desconto-repository';
import { HttpResponse } from '@shared/helpers';

@injectable()
class MultiDeleteDescontoUseCase {
  constructor(@inject('DescontoRepository')
    private descontoRepository: IDescontoRepository
  ) {}

  async execute(ids: string[]): Promise<HttpResponse> {
    const desconto = await this.descontoRepository.multiDelete(ids)

    return desconto
  }
}

export { MultiDeleteDescontoUseCase }
