import { inject, injectable } from 'tsyringe'
import { Balanco } from '@modules/clientes/infra/typeorm/entities/balanco'
import { IBalancoRepository } from '@modules/clientes/repositories/i-balanco-repository'
import { AppError } from '@shared/errors/app-error'

interface IRequest {
  clienteId: string
  saldoDevedor: number
  desabilitado: boolean
}

@injectable()
class CreateBalancoUseCase {
  constructor(@inject('BalancoRepository')
    private balancoRepository: IBalancoRepository
  ) {}

  async execute({
    clienteId,
    saldoDevedor,
    desabilitado
  }: IRequest): Promise<Balanco> {
    const result = await this.balancoRepository.create({
        clienteId,
        saldoDevedor,
        desabilitado
      })
      .then(balancoResult => {
        return balancoResult
      })
      .catch(error => {
        return error
      })

    return result
  }
}

export { CreateBalancoUseCase }
