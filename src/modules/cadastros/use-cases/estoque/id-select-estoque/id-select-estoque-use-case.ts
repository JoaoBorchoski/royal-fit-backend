import { inject, injectable } from "tsyringe"
import { IEstoqueRepository } from '@modules/cadastros/repositories/i-estoque-repository'
import { HttpResponse } from '@shared/helpers/http'

@injectable()
class IdSelectEstoqueUseCase {
  constructor(@inject('EstoqueRepository')
    private estoqueRepository: IEstoqueRepository
  ) {}

  async execute({ id }): Promise<HttpResponse> {
    const estoque = await this.estoqueRepository.idSelect(id)

    return estoque
  }
}

export { IdSelectEstoqueUseCase }
