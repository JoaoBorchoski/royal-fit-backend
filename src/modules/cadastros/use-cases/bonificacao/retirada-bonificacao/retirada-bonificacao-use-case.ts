import { inject, injectable } from "tsyringe"
import { Bonificacao } from "@modules/cadastros/infra/typeorm/entities/bonificacao"
import { IBonificacaoRepository } from "@modules/cadastros/repositories/i-bonificacao-repository"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse } from "@shared/helpers"

interface IRequest {
  id: string
  clienteId: string
  quantidade: number
}

@injectable()
class RetiradaBonificacaoUseCase {
  constructor(
    @inject("BonificacaoRepository")
    private bonificacaoRepository: IBonificacaoRepository
  ) {}

  async execute({ id, clienteId, quantidade }: IRequest): Promise<HttpResponse> {
    const oldBonificacao = await this.bonificacaoRepository.getByClienteId(clienteId)

    const bonificacao = await this.bonificacaoRepository.update({
      id: oldBonificacao.data.id,
      clienteId,
      bonificacaoDisponivel: oldBonificacao.data.bonificacaoDisponivel - quantidade,
    })

    return bonificacao
  }
}

export { RetiradaBonificacaoUseCase }
