import { inject, injectable } from 'tsyringe'
import { IRelatorioClienteRepository } from '@modules/relatorios/repositories/i-relatorio-cliente-repository';
import { HttpResponse } from '@shared/helpers';

@injectable()
class MultiDeleteRelatorioClienteUseCase {
  constructor(@inject('RelatorioClienteRepository')
    private relatorioClienteRepository: IRelatorioClienteRepository
  ) {}

  async execute(ids: string[]): Promise<HttpResponse> {
    const relatorioCliente = await this.relatorioClienteRepository.multiDelete(ids)

    return relatorioCliente
  }
}

export { MultiDeleteRelatorioClienteUseCase }
