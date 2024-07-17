import { inject, injectable } from "tsyringe"
import { Estoque } from "@modules/cadastros/infra/typeorm/entities/estoque"
import { IEstoqueRepository } from "@modules/cadastros/repositories/i-estoque-repository"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse, serverError } from "@shared/helpers"

interface IRequest {
  produtoId: string
  quantidade: number
  desabilitado: boolean
}

@injectable()
class CreateEstoqueUseCase {
  constructor(
    @inject("EstoqueRepository")
    private estoqueRepository: IEstoqueRepository
  ) {}

  async execute({ produtoId, quantidade, desabilitado }: IRequest): Promise<HttpResponse> {
    try {
      const estoque = await this.estoqueRepository.getByProdutoId(produtoId)

      if (estoque.data) {
        throw new AppError("Estoque já cadastrado para este produto")
      }

      const result = await this.estoqueRepository
        .create({
          produtoId,
          quantidade,
          desabilitado,
        })
        .then((estoqueResult) => {
          return estoqueResult
        })
        .catch((error) => {
          return error
        })

      return result
    } catch (error) {
      return error
    }
  }
}

export { CreateEstoqueUseCase }
