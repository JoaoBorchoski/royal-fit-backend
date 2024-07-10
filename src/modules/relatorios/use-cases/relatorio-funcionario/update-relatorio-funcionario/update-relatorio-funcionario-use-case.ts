import { inject, injectable } from 'tsyringe'
import { RelatorioFuncionario } from '@modules/relatorios/infra/typeorm/entities/relatorio-funcionario'
import { IRelatorioFuncionarioRepository } from '@modules/relatorios/repositories/i-relatorio-funcionario-repository'
import { AppError } from '@shared/errors/app-error'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  id: string
  funcionarioId: string
  dataInicio: Date
  dataFim: Date
  relatório: string
  desabilitado: boolean
}

@injectable()
class UpdateRelatorioFuncionarioUseCase {
  constructor(@inject('RelatorioFuncionarioRepository')
    private relatorioFuncionarioRepository: IRelatorioFuncionarioRepository
  ) {}

  async execute({
    id,
    funcionarioId,
    dataInicio,
    dataFim,
    relatório,
    desabilitado
  }: IRequest): Promise<HttpResponse> {
    const relatorioFuncionario = await this.relatorioFuncionarioRepository.update({
      id,
      funcionarioId,
      dataInicio,
      dataFim,
      relatório,
      desabilitado
    })

    return relatorioFuncionario
  }
}

export { UpdateRelatorioFuncionarioUseCase }
