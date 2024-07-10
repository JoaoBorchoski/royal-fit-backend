import { inject, injectable } from 'tsyringe'
import { RelatorioCliente } from '@modules/relatorios/infra/typeorm/entities/relatorio-cliente'
import { IRelatorioClienteRepository } from '@modules/relatorios/repositories/i-relatorio-cliente-repository'
import { AppError } from '@shared/errors/app-error'

interface IRequest {
  clienteId: string
  dataInicio: Date
  dataFim: Date
  relatório: string
  desabilitado: boolean
}

@injectable()
class CreateRelatorioClienteUseCase {
  constructor(@inject('RelatorioClienteRepository')
    private relatorioClienteRepository: IRelatorioClienteRepository
  ) {}

  async execute({
    clienteId,
    dataInicio,
    dataFim,
    relatório,
    desabilitado
  }: IRequest): Promise<RelatorioCliente> {
    const result = await this.relatorioClienteRepository.create({
        clienteId,
        dataInicio,
        dataFim,
        relatório,
        desabilitado
      })
      .then(relatorioClienteResult => {
        return relatorioClienteResult
      })
      .catch(error => {
        return error
      })

    return result
  }
}

export { CreateRelatorioClienteUseCase }
