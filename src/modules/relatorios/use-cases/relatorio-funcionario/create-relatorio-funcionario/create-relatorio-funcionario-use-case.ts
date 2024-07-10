import { inject, injectable } from 'tsyringe'
import { RelatorioFuncionario } from '@modules/relatorios/infra/typeorm/entities/relatorio-funcionario'
import { IRelatorioFuncionarioRepository } from '@modules/relatorios/repositories/i-relatorio-funcionario-repository'
import { AppError } from '@shared/errors/app-error'

interface IRequest {
  funcionarioId: string
  dataInicio: Date
  dataFim: Date
  relatório: string
  desabilitado: boolean
}

@injectable()
class CreateRelatorioFuncionarioUseCase {
  constructor(@inject('RelatorioFuncionarioRepository')
    private relatorioFuncionarioRepository: IRelatorioFuncionarioRepository
  ) {}

  async execute({
    funcionarioId,
    dataInicio,
    dataFim,
    relatório,
    desabilitado
  }: IRequest): Promise<RelatorioFuncionario> {
    const result = await this.relatorioFuncionarioRepository.create({
        funcionarioId,
        dataInicio,
        dataFim,
        relatório,
        desabilitado
      })
      .then(relatorioFuncionarioResult => {
        return relatorioFuncionarioResult
      })
      .catch(error => {
        return error
      })

    return result
  }
}

export { CreateRelatorioFuncionarioUseCase }
