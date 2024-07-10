import { inject, injectable } from 'tsyringe'
import { MeioPagamento } from '@modules/cadastros/infra/typeorm/entities/meio-pagamento'
import { IMeioPagamentoRepository } from '@modules/cadastros/repositories/i-meio-pagamento-repository'
import { AppError } from '@shared/errors/app-error'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  id: string
  nome: string
  descricao: string
  desabilitado: boolean
}

@injectable()
class UpdateMeioPagamentoUseCase {
  constructor(@inject('MeioPagamentoRepository')
    private meioPagamentoRepository: IMeioPagamentoRepository
  ) {}

  async execute({
    id,
    nome,
    descricao,
    desabilitado
  }: IRequest): Promise<HttpResponse> {
    const meioPagamento = await this.meioPagamentoRepository.update({
      id,
      nome,
      descricao,
      desabilitado
    })

    return meioPagamento
  }
}

export { UpdateMeioPagamentoUseCase }
