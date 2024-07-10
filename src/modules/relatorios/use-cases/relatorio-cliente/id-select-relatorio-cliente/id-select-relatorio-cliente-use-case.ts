import { inject, injectable } from "tsyringe"
import { IRelatorioClienteRepository } from '@modules/relatorios/repositories/i-relatorio-cliente-repository'
import { HttpResponse } from '@shared/helpers/http'

@injectable()
class IdSelectRelatorioClienteUseCase {
  constructor(@inject('RelatorioClienteRepository')
    private relatorioClienteRepository: IRelatorioClienteRepository
  ) {}

  async execute({ id }): Promise<HttpResponse> {
    const relatorioCliente = await this.relatorioClienteRepository.idSelect(id)

    return relatorioCliente
  }
}

export { IdSelectRelatorioClienteUseCase }
