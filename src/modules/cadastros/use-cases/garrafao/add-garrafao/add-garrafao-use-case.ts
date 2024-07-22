import { inject, injectable } from "tsyringe"
import { Garrafao } from "@modules/cadastros/infra/typeorm/entities/garrafao"
import { IGarrafaoRepository } from "@modules/cadastros/repositories/i-garrafao-repository"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse } from "@shared/helpers"

interface IRequest {
  id: string
  clienteId: string
  quantidade: number
}

@injectable()
class AddGarrafaoUseCase {
  constructor(
    @inject("GarrafaoRepository")
    private garrafaoRepository: IGarrafaoRepository
  ) {}

  async execute({ id, clienteId, quantidade }: IRequest): Promise<HttpResponse> {
    console.log(id, clienteId, quantidade)
    const oldGarrafao = await this.garrafaoRepository.getByClienteId(clienteId)

    const garrafao = await this.garrafaoRepository.update({
      id: oldGarrafao.data.id,
      clienteId,
      quantidade: oldGarrafao.data.quantidade + quantidade,
    })

    return garrafao
  }
}

export { AddGarrafaoUseCase }
