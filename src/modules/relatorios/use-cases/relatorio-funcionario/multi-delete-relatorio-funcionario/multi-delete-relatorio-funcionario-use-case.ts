import { inject, injectable } from 'tsyringe'
import { IRelatorioFuncionarioRepository } from '@modules/relatorios/repositories/i-relatorio-funcionario-repository';
import { HttpResponse } from '@shared/helpers';

@injectable()
class MultiDeleteRelatorioFuncionarioUseCase {
  constructor(@inject('RelatorioFuncionarioRepository')
    private relatorioFuncionarioRepository: IRelatorioFuncionarioRepository
  ) {}

  async execute(ids: string[]): Promise<HttpResponse> {
    const relatorioFuncionario = await this.relatorioFuncionarioRepository.multiDelete(ids)

    return relatorioFuncionario
  }
}

export { MultiDeleteRelatorioFuncionarioUseCase }
