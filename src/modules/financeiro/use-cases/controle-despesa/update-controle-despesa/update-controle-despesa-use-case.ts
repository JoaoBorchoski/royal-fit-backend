import { inject, injectable } from "tsyringe"
import { ControleDespesa } from "@modules/financeiro/infra/typeorm/entities/controle-despesa"
import { IControleDespesaRepository } from "@modules/financeiro/repositories/i-controle-despesa-repository"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse } from "@shared/helpers"

interface IRequest {
  id: string
  dataEmissao: Date
  dataVencimento: Date
  descricao: string
  valor: number
  status: number
  categoria: string
  codigoBarras: string
  pedidoId: string
  clienteId: string
  formaPagamentoId: string
}

@injectable()
class UpdateControleDespesaUseCase {
  constructor(
    @inject("ControleDespesaRepository")
    private controleDespesaRepository: IControleDespesaRepository
  ) {}

  async execute({
    id,
    dataEmissao,
    dataVencimento,
    descricao,
    valor,
    status,
    categoria,
    codigoBarras,
    pedidoId,
    clienteId,
    formaPagamentoId,
  }: IRequest): Promise<HttpResponse> {
    const controleDespesa = await this.controleDespesaRepository.update({
      id,
      dataEmissao,
      dataVencimento,
      descricao,
      valor,
      status,
      categoria,
      codigoBarras,
      pedidoId,
      clienteId,
      formaPagamentoId,
    })

    return controleDespesa
  }
}

export { UpdateControleDespesaUseCase }
