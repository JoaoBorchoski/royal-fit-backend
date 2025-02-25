import { inject, injectable } from "tsyringe"
import { IControleDespesaRepository } from "@modules/financeiro/repositories/i-controle-despesa-repository"
import { IControleDespesaDTO } from "@modules/financeiro/dtos/i-controle-despesa-dto"

interface IRequest {
  search: string
  page: number
  rowsPerPage: number
  order: string
  filter?: string
}

interface ResponseProps {
  items: IControleDespesaDTO[]
  hasNext: boolean
}

@injectable()
class ListControleDespesaUseCase {
  constructor(
    @inject("ControleDespesaRepository")
    private controleDespesaRepository: IControleDespesaRepository
  ) {}

  async execute({ search = "", page = 0, rowsPerPage = 50, order = "", filter }: IRequest): Promise<ResponseProps> {
    const newPage = page !== 0 ? page - 1 : 0

    const controleDespesas = await this.controleDespesaRepository.list(search, newPage, rowsPerPage, order, filter)

    const countControleDespesas = await this.controleDespesaRepository.count(search, filter)

    const numeroControleDespesa = page * rowsPerPage

    const controleDespesasResponse = {
      items: controleDespesas.data,
      hasNext: numeroControleDespesa < countControleDespesas.data.count,
    }

    return controleDespesasResponse
  }
}

export { ListControleDespesaUseCase }
