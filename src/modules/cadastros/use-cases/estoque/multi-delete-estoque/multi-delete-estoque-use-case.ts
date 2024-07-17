import { inject, injectable } from 'tsyringe'
import { IEstoqueRepository } from '@modules/cadastros/repositories/i-estoque-repository';
import { HttpResponse } from '@shared/helpers';

@injectable()
class MultiDeleteEstoqueUseCase {
  constructor(@inject('EstoqueRepository')
    private estoqueRepository: IEstoqueRepository
  ) {}

  async execute(ids: string[]): Promise<HttpResponse> {
    const estoque = await this.estoqueRepository.multiDelete(ids)

    return estoque
  }
}

export { MultiDeleteEstoqueUseCase }
