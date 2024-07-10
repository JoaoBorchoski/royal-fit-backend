import { inject, injectable } from 'tsyringe'
import { RelatorioFuncionario } from '@modules/relatorios/infra/typeorm/entities/relatorio-funcionario'
import { IRelatorioFuncionarioRepository } from '@modules/relatorios/repositories/i-relatorio-funcionario-repository'
import { HttpResponse } from '@shared/helpers'

@injectable()
class DeleteRelatorioFuncionarioUseCase {
  constructor(@inject('RelatorioFuncionarioRepository')
    private relatorioFuncionarioRepository: IRelatorioFuncionarioRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const relatorioFuncionario = await this.relatorioFuncionarioRepository.delete(id)

    return relatorioFuncionario
  }
}

export { DeleteRelatorioFuncionarioUseCase }
