import { inject, injectable } from 'tsyringe'
import { Garrafao } from '@modules/cadastros/infra/typeorm/entities/garrafao'
import { IGarrafaoRepository } from '@modules/cadastros/repositories/i-garrafao-repository'
import { AppError } from '@shared/errors/app-error'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  id: string
  clienteId: string
  quantidade: number
  desabilitado: boolean
}

@injectable()
class UpdateGarrafaoUseCase {
  constructor(@inject('GarrafaoRepository')
    private garrafaoRepository: IGarrafaoRepository
  ) {}

  async execute({
    id,
    clienteId,
    quantidade,
    desabilitado
  }: IRequest): Promise<HttpResponse> {
    const garrafao = await this.garrafaoRepository.update({
      id,
      clienteId,
      quantidade,
      desabilitado
    })

    return garrafao
  }
}

export { UpdateGarrafaoUseCase }
