import { inject, injectable } from "tsyringe"
import { ControleDespesa } from "@modules/financeiro/infra/typeorm/entities/controle-despesa"
import { IControleDespesaRepository } from "@modules/financeiro/repositories/i-controle-despesa-repository"
import { AppError } from "@shared/errors/app-error"

interface IRequest {
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
class CreateControleDespesaUseCase {
  constructor(
    @inject("ControleDespesaRepository")
    private controleDespesaRepository: IControleDespesaRepository
  ) {}

  async execute({
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
  }: IRequest): Promise<ControleDespesa> {
    const result = await this.controleDespesaRepository
      .create({
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
      .then((controleDespesaResult) => {
        return controleDespesaResult
      })
      .catch((error) => {
        return error
      })

    return result
  }
}

export { CreateControleDespesaUseCase }
