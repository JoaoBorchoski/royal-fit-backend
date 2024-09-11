import { inject, injectable } from "tsyringe"

import { AppError } from "@shared/errors/app-error"
import { IEntradaGarrafaoRepository } from "@modules/cadastros/repositories/i-entrada-garrafao-repository"
import { EntradaGarrafao } from "@modules/cadastros/infra/typeorm/entities/entrada-garrafao"

interface IRequest {
  clienteId: string
  quantidade: number
  isRoyalfit: boolean
  desabilitado: boolean
}

@injectable()
class CreateEntradaGarrafaoUseCase {
  constructor(
    @inject("EntradaGarrafaoRepository")
    private entradaGarrafaoRepository: IEntradaGarrafaoRepository
  ) {}

  async execute({ clienteId, quantidade, isRoyalfit, desabilitado }: IRequest): Promise<EntradaGarrafao> {
    const result = await this.entradaGarrafaoRepository
      .create({
        clienteId,
        quantidade,
        isRoyalfit,
        desabilitado,
      })
      .then((entradaGarrafaoResult) => {
        return entradaGarrafaoResult
      })
      .catch((error) => {
        return error
      })

    return result
  }
}

export { CreateEntradaGarrafaoUseCase }
