import { inject, injectable } from "tsyringe"
import { IRelatorioFuncionarioRepository } from '@modules/relatorios/repositories/i-relatorio-funcionario-repository'
import { HttpResponse } from '@shared/helpers/http'

@injectable()
class IdSelectRelatorioFuncionarioUseCase {
  constructor(@inject('RelatorioFuncionarioRepository')
    private relatorioFuncionarioRepository: IRelatorioFuncionarioRepository
  ) {}

  async execute({ id }): Promise<HttpResponse> {
    const relatorioFuncionario = await this.relatorioFuncionarioRepository.idSelect(id)

    return relatorioFuncionario
  }
}

export { IdSelectRelatorioFuncionarioUseCase }
