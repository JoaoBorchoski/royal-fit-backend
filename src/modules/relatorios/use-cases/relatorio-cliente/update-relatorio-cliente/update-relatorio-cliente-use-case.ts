import { inject, injectable } from 'tsyringe'
import { RelatorioCliente } from '@modules/relatorios/infra/typeorm/entities/relatorio-cliente'
import { IRelatorioClienteRepository } from '@modules/relatorios/repositories/i-relatorio-cliente-repository'
import { AppError } from '@shared/errors/app-error'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  id: string
  clienteId: string
  dataInicio: Date
  dataFim: Date
  relatório: string
  desabilitado: boolean
}

@injectable()
class UpdateRelatorioClienteUseCase {
  constructor(@inject('RelatorioClienteRepository')
    private relatorioClienteRepository: IRelatorioClienteRepository
  ) {}

  async execute({
    id,
    clienteId,
    dataInicio,
    dataFim,
    relatório,
    desabilitado
  }: IRequest): Promise<HttpResponse> {
    const relatorioCliente = await this.relatorioClienteRepository.update({
      id,
      clienteId,
      dataInicio,
      dataFim,
      relatório,
      desabilitado
    })

    return relatorioCliente
  }
}

export { UpdateRelatorioClienteUseCase }
