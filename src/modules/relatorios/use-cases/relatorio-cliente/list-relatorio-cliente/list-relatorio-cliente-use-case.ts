import { inject, injectable } from 'tsyringe'
import { IRelatorioClienteRepository } from '@modules/relatorios/repositories/i-relatorio-cliente-repository'
import { IRelatorioClienteDTO } from '@modules/relatorios/dtos/i-relatorio-cliente-dto';

interface IRequest {
  search: string,
  page: number,
  rowsPerPage: number,
  order: string,
  filter?: string
}

interface ResponseProps {
  items: IRelatorioClienteDTO[],
  hasNext: boolean
}

@injectable()
class ListRelatorioClienteUseCase {
  constructor(@inject('RelatorioClienteRepository')
    private relatorioClienteRepository: IRelatorioClienteRepository
  ) {}

  async execute({
    search = '',
    page = 0,
    rowsPerPage = 50,
    order = '',
    filter
  }: IRequest): Promise<ResponseProps> {
    const newPage = page !== 0 ? page - 1 : 0

    const relatoriosClientes = await this.relatorioClienteRepository.list(
      search,
      newPage,
      rowsPerPage,
      order,
      filter
    )

    const countRelatoriosClientes = await this.relatorioClienteRepository.count(
      search,
      filter
    )

    const numeroRelatorioCliente = page * rowsPerPage

    const relatoriosClientesResponse = {
      items: relatoriosClientes.data,
      hasNext: numeroRelatorioCliente < countRelatoriosClientes.data.count
    }

    return relatoriosClientesResponse
  }
}

export { ListRelatorioClienteUseCase }
