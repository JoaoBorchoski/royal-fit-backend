import { inject, injectable } from 'tsyringe'
import { IRelatorioFuncionarioRepository } from '@modules/relatorios/repositories/i-relatorio-funcionario-repository'

interface ResponseProps {
  items?: object[]
  hasNext?: boolean
  value?: string
  label?: string
}

@injectable()
class SelectRelatorioFuncionarioUseCase {
  constructor(@inject('RelatorioFuncionarioRepository')
    private relatorioFuncionarioRepository: IRelatorioFuncionarioRepository
  ) {}

  async execute({
    filter,
  }): Promise<ResponseProps> {
    const relatoriosFuncionarios = await this.relatorioFuncionarioRepository.select(filter)

    const newRelatoriosFuncionarios = {
      items: relatoriosFuncionarios.data,
      hasNext: false
    }

    return newRelatoriosFuncionarios
  }
}

export { SelectRelatorioFuncionarioUseCase }
