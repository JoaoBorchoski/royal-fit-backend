import { inject, injectable } from 'tsyringe'
import { Balanco } from '@modules/clientes/infra/typeorm/entities/balanco'
import { IBalancoRepository } from '@modules/clientes/repositories/i-balanco-repository'
import { AppError } from '@shared/errors/app-error'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  id: string
  clienteId: string
  saldoDevedor: number
  desabilitado: boolean
}

@injectable()
class UpdateBalancoUseCase {
  constructor(@inject('BalancoRepository')
    private balancoRepository: IBalancoRepository
  ) {}

  async execute({
    id,
    clienteId,
    saldoDevedor,
    desabilitado
  }: IRequest): Promise<HttpResponse> {
    const balanco = await this.balancoRepository.update({
      id,
      clienteId,
      saldoDevedor,
      desabilitado
    })

    return balanco
  }
}

export { UpdateBalancoUseCase }
