import { inject, injectable } from "tsyringe"
import { Desconto } from "@modules/clientes/infra/typeorm/entities/desconto"
import { IDescontoRepository } from "@modules/clientes/repositories/i-desconto-repository"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse } from "@shared/helpers"

interface IRequest {
  id: string
  clienteId: string
  produtoId: string
  desconto: number
  desabilitado: boolean
}

@injectable()
class UpdateDescontoUseCase {
  constructor(
    @inject("DescontoRepository")
    private descontoRepository: IDescontoRepository
  ) {}

  async execute({ id, clienteId, produtoId, desconto, desabilitado }: IRequest): Promise<HttpResponse> {
    const result = await this.descontoRepository.update({
      id,
      clienteId,
      produtoId,
      desconto,
      desabilitado,
    })

    return result
  }
}

export { UpdateDescontoUseCase }
