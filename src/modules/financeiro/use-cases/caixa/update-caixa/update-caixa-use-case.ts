import { inject, injectable } from 'tsyringe'
import { Caixa } from '@modules/financeiro/infra/typeorm/entities/caixa'
import { ICaixaRepository } from '@modules/financeiro/repositories/i-caixa-repository'
import { AppError } from '@shared/errors/app-error'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  id: string
  descricao: string
  valor: number
  data: Date
  pedidoId: string
  clienteId: string
  formaPagamentoId: string
}

@injectable()
class UpdateCaixaUseCase {
  constructor(@inject('CaixaRepository')
    private caixaRepository: ICaixaRepository
  ) {}

  async execute({
    id,
    descricao,
    valor,
    data,
    pedidoId,
    clienteId,
    formaPagamentoId
  }: IRequest): Promise<HttpResponse> {
    const caixa = await this.caixaRepository.update({
      id,
      descricao,
      valor,
      data,
      pedidoId,
      clienteId,
      formaPagamentoId
    })

    return caixa
  }
}

export { UpdateCaixaUseCase }
