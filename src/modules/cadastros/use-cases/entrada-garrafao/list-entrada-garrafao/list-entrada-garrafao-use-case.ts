import { IEntradaGarrafaoDTO } from "@modules/cadastros/dtos/i-entrada-garrafao-dto"
import { IEntradaGarrafaoRepository } from "@modules/cadastros/repositories/i-entrada-garrafao-repository"
import { inject, injectable } from "tsyringe"

interface IRequest {
  search: string
  page: number
  rowsPerPage: number
  order: string
  filter?: string
}

interface ResponseProps {
  items: IEntradaGarrafaoDTO[]
  hasNext: boolean
}

@injectable()
class ListEntradaGarrafaoUseCase {
  constructor(
    @inject("EntradaGarrafaoRepository")
    private entradaGarrafaoRepository: IEntradaGarrafaoRepository
  ) {}

  async execute({ search = "", page = 0, rowsPerPage = 50, order = "", filter }: IRequest): Promise<ResponseProps> {
    const newPage = page !== 0 ? page - 1 : 0

    const entradasGarrafao = await this.entradaGarrafaoRepository.list(search, newPage, rowsPerPage, order, filter)

    const countEntradasGarrafao = await this.entradaGarrafaoRepository.count(search, filter)

    const numeroEntradaGarrafao = page * rowsPerPage

    const entradasGarrafaoResponse = {
      items: entradasGarrafao.data,
      hasNext: numeroEntradaGarrafao < countEntradasGarrafao.data.count,
    }

    return entradasGarrafaoResponse
  }
}

export { ListEntradaGarrafaoUseCase }
