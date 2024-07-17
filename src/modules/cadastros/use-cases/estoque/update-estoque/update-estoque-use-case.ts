import { inject, injectable } from 'tsyringe'
import { Estoque } from '@modules/cadastros/infra/typeorm/entities/estoque'
import { IEstoqueRepository } from '@modules/cadastros/repositories/i-estoque-repository'
import { AppError } from '@shared/errors/app-error'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  id: string
  produtoId: string
  quantidade: number
  desabilitado: boolean
}

@injectable()
class UpdateEstoqueUseCase {
  constructor(@inject('EstoqueRepository')
    private estoqueRepository: IEstoqueRepository
  ) {}

  async execute({
    id,
    produtoId,
    quantidade,
    desabilitado
  }: IRequest): Promise<HttpResponse> {
    const estoque = await this.estoqueRepository.update({
      id,
      produtoId,
      quantidade,
      desabilitado
    })

    return estoque
  }
}

export { UpdateEstoqueUseCase }
