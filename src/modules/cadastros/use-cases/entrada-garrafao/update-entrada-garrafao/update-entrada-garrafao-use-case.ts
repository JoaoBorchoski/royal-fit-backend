import { inject, injectable } from "tsyringe"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse } from "@shared/helpers"
import { IEntradaGarrafaoRepository } from "@modules/cadastros/repositories/i-entrada-garrafao-repository"

interface IRequest {
  id: string
  clienteId: string
  quantidade: number
  isRoyalfit: boolean
  desabilitado: boolean
}

@injectable()
class UpdateEntradaGarrafaoUseCase {
  constructor(
    @inject("EntradaGarrafaoRepository")
    private entradaGarrafaoRepository: IEntradaGarrafaoRepository
  ) {}

  async execute({ id, clienteId, quantidade, isRoyalfit, desabilitado }: IRequest): Promise<HttpResponse> {
    const entradaGarrafao = await this.entradaGarrafaoRepository.update({
      id,
      clienteId,
      quantidade,
      isRoyalfit,
      desabilitado,
    })

    return entradaGarrafao
  }
}

export { UpdateEntradaGarrafaoUseCase }
