import { inject, injectable } from 'tsyringe'
import { Bonificacao } from '@modules/cadastros/infra/typeorm/entities/bonificacao'
import { IBonificacaoRepository } from '@modules/cadastros/repositories/i-bonificacao-repository'
import { AppError } from '@shared/errors/app-error'

interface IRequest {
  clienteId: string
  totalVendido: number
  bonificacaoDisponivel: number
  desabilitado: boolean
}

@injectable()
class CreateBonificacaoUseCase {
  constructor(@inject('BonificacaoRepository')
    private bonificacaoRepository: IBonificacaoRepository
  ) {}

  async execute({
    clienteId,
    totalVendido,
    bonificacaoDisponivel,
    desabilitado
  }: IRequest): Promise<Bonificacao> {
    const result = await this.bonificacaoRepository.create({
        clienteId,
        totalVendido,
        bonificacaoDisponivel,
        desabilitado
      })
      .then(bonificacaoResult => {
        return bonificacaoResult
      })
      .catch(error => {
        return error
      })

    return result
  }
}

export { CreateBonificacaoUseCase }
