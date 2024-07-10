import { inject, injectable } from 'tsyringe'
import { IRelatorioFuncionarioRepository } from '@modules/relatorios/repositories/i-relatorio-funcionario-repository'
import { IRelatorioFuncionarioDTO } from '@modules/relatorios/dtos/i-relatorio-funcionario-dto';

interface IRequest {
  search: string,
  page: number,
  rowsPerPage: number,
  order: string,
  filter?: string
}

interface ResponseProps {
  items: IRelatorioFuncionarioDTO[],
  hasNext: boolean
}

@injectable()
class ListRelatorioFuncionarioUseCase {
  constructor(@inject('RelatorioFuncionarioRepository')
    private relatorioFuncionarioRepository: IRelatorioFuncionarioRepository
  ) {}

  async execute({
    search = '',
    page = 0,
    rowsPerPage = 50,
    order = '',
    filter
  }: IRequest): Promise<ResponseProps> {
    const newPage = page !== 0 ? page - 1 : 0

    const relatoriosFuncionarios = await this.relatorioFuncionarioRepository.list(
      search,
      newPage,
      rowsPerPage,
      order,
      filter
    )

    const countRelatoriosFuncionarios = await this.relatorioFuncionarioRepository.count(
      search,
      filter
    )

    const numeroRelatorioFuncionario = page * rowsPerPage

    const relatoriosFuncionariosResponse = {
      items: relatoriosFuncionarios.data,
      hasNext: numeroRelatorioFuncionario < countRelatoriosFuncionarios.data.count
    }

    return relatoriosFuncionariosResponse
  }
}

export { ListRelatorioFuncionarioUseCase }
