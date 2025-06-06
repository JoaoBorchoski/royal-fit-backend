import { inject, injectable } from 'tsyringe'
import { RelatorioCliente } from '@modules/relatorios/infra/typeorm/entities/relatorio-cliente'
import { IRelatorioClienteRepository } from '@modules/relatorios/repositories/i-relatorio-cliente-repository'
import { HttpResponse } from '@shared/helpers'

@injectable()
class DeleteRelatorioClienteUseCase {
  constructor(@inject('RelatorioClienteRepository')
    private relatorioClienteRepository: IRelatorioClienteRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const relatorioCliente = await this.relatorioClienteRepository.delete(id)

    return relatorioCliente
  }
}

export { DeleteRelatorioClienteUseCase }
