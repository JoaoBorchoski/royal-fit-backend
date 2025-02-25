import { inject, injectable } from 'tsyringe'
import { Caixa } from '@modules/financeiro/infra/typeorm/entities/caixa'
import { ICaixaRepository } from '@modules/financeiro/repositories/i-caixa-repository'
import { AppError } from '@shared/errors/app-error'

interface IRequest {
  descricao: string
  valor: number
  data: Date
  pedidoId: string
  clienteId: string
  formaPagamentoId: string
}

@injectable()
class CreateCaixaUseCase {
  constructor(@inject('CaixaRepository')
    private caixaRepository: ICaixaRepository
  ) {}

  async execute({
    descricao,
    valor,
    data,
    pedidoId,
    clienteId,
    formaPagamentoId
  }: IRequest): Promise<Caixa> {
    const result = await this.caixaRepository.create({
        descricao,
        valor,
        data,
        pedidoId,
        clienteId,
        formaPagamentoId
      })
      .then(caixaResult => {
        return caixaResult
      })
      .catch(error => {
        return error
      })

    return result
  }
}

export { CreateCaixaUseCase }
