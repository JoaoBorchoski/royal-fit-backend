import { inject, injectable } from 'tsyringe'
import { IBalancoRepository } from '@modules/clientes/repositories/i-balanco-repository';
import { HttpResponse } from '@shared/helpers';

@injectable()
class MultiDeleteBalancoUseCase {
  constructor(@inject('BalancoRepository')
    private balancoRepository: IBalancoRepository
  ) {}

  async execute(ids: string[]): Promise<HttpResponse> {
    const balanco = await this.balancoRepository.multiDelete(ids)

    return balanco
  }
}

export { MultiDeleteBalancoUseCase }
