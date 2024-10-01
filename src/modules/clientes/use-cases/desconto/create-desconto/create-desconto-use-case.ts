import { inject, injectable } from 'tsyringe'
import { Desconto } from '@modules/clientes/infra/typeorm/entities/desconto'
import { IDescontoRepository } from '@modules/clientes/repositories/i-desconto-repository'
import { AppError } from '@shared/errors/app-error'

interface IRequest {
  clienteId: string
  produtoId: string
  desconto: number
  desabilitado: boolean
}

@injectable()
class CreateDescontoUseCase {
  constructor(@inject('DescontoRepository')
    private descontoRepository: IDescontoRepository
  ) {}

  async execute({
    clienteId,
    produtoId,
    desconto,
    desabilitado
  }: IRequest): Promise<Desconto> {
    const result = await this.descontoRepository.create({
        clienteId,
        produtoId,
        desconto,
        desabilitado
      })
      .then(descontoResult => {
        return descontoResult
      })
      .catch(error => {
        return error
      })

    return result
  }
}

export { CreateDescontoUseCase }
