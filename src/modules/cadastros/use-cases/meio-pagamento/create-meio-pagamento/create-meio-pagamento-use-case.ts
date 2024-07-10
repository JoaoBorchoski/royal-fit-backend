import { inject, injectable } from 'tsyringe'
import { MeioPagamento } from '@modules/cadastros/infra/typeorm/entities/meio-pagamento'
import { IMeioPagamentoRepository } from '@modules/cadastros/repositories/i-meio-pagamento-repository'
import { AppError } from '@shared/errors/app-error'

interface IRequest {
  nome: string
  descricao: string
  desabilitado: boolean
}

@injectable()
class CreateMeioPagamentoUseCase {
  constructor(@inject('MeioPagamentoRepository')
    private meioPagamentoRepository: IMeioPagamentoRepository
  ) {}

  async execute({
    nome,
    descricao,
    desabilitado
  }: IRequest): Promise<MeioPagamento> {
    const result = await this.meioPagamentoRepository.create({
        nome,
        descricao,
        desabilitado
      })
      .then(meioPagamentoResult => {
        return meioPagamentoResult
      })
      .catch(error => {
        return error
      })

    return result
  }
}

export { CreateMeioPagamentoUseCase }
