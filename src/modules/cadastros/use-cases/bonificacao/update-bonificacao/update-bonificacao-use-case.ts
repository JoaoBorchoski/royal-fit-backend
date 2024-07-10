import { inject, injectable } from 'tsyringe'
import { Bonificacao } from '@modules/cadastros/infra/typeorm/entities/bonificacao'
import { IBonificacaoRepository } from '@modules/cadastros/repositories/i-bonificacao-repository'
import { AppError } from '@shared/errors/app-error'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  id: string
  clienteId: string
  totalVendido: number
  bonificacaoDisponivel: number
  desabilitado: boolean
}

@injectable()
class UpdateBonificacaoUseCase {
  constructor(@inject('BonificacaoRepository')
    private bonificacaoRepository: IBonificacaoRepository
  ) {}

  async execute({
    id,
    clienteId,
    totalVendido,
    bonificacaoDisponivel,
    desabilitado
  }: IRequest): Promise<HttpResponse> {
    const bonificacao = await this.bonificacaoRepository.update({
      id,
      clienteId,
      totalVendido,
      bonificacaoDisponivel,
      desabilitado
    })

    return bonificacao
  }
}

export { UpdateBonificacaoUseCase }
