import { inject, injectable } from 'tsyringe'
import { Garrafao } from '@modules/cadastros/infra/typeorm/entities/garrafao'
import { IGarrafaoRepository } from '@modules/cadastros/repositories/i-garrafao-repository'
import { AppError } from '@shared/errors/app-error'

interface IRequest {
  clienteId: string
  quantidade: number
  desabilitado: boolean
}

@injectable()
class CreateGarrafaoUseCase {
  constructor(@inject('GarrafaoRepository')
    private garrafaoRepository: IGarrafaoRepository
  ) {}

  async execute({
    clienteId,
    quantidade,
    desabilitado
  }: IRequest): Promise<Garrafao> {
    const result = await this.garrafaoRepository.create({
        clienteId,
        quantidade,
        desabilitado
      })
      .then(garrafaoResult => {
        return garrafaoResult
      })
      .catch(error => {
        return error
      })

    return result
  }
}

export { CreateGarrafaoUseCase }
