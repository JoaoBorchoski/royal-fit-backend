import { inject, injectable } from 'tsyringe'
import { RelatorioFuncionario } from '@modules/relatorios/infra/typeorm/entities/relatorio-funcionario'
import { IRelatorioFuncionarioRepository } from '@modules/relatorios/repositories/i-relatorio-funcionario-repository'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  search: string,
  filter?: string
}

@injectable()
class CountRelatorioFuncionarioUseCase {
  constructor(@inject('RelatorioFuncionarioRepository')
    private relatorioFuncionarioRepository: IRelatorioFuncionarioRepository
  ) {}

  async execute({
    search,
    filter
  }: IRequest): Promise<HttpResponse> {
    const relatoriosFuncionariosCount = await this.relatorioFuncionarioRepository.count(
      search,
      filter
    )

    return relatoriosFuncionariosCount
  }
}

export { CountRelatorioFuncionarioUseCase }
