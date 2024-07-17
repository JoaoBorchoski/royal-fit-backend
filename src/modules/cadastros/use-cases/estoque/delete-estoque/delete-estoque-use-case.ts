import { inject, injectable } from 'tsyringe'
import { Estoque } from '@modules/cadastros/infra/typeorm/entities/estoque'
import { IEstoqueRepository } from '@modules/cadastros/repositories/i-estoque-repository'
import { HttpResponse } from '@shared/helpers'

@injectable()
class DeleteEstoqueUseCase {
  constructor(@inject('EstoqueRepository')
    private estoqueRepository: IEstoqueRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const estoque = await this.estoqueRepository.delete(id)

    return estoque
  }
}

export { DeleteEstoqueUseCase }
