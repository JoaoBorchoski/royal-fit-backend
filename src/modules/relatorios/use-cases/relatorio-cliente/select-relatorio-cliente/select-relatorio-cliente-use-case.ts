import { inject, injectable } from 'tsyringe'
import { IRelatorioClienteRepository } from '@modules/relatorios/repositories/i-relatorio-cliente-repository'

interface ResponseProps {
  items?: object[]
  hasNext?: boolean
  value?: string
  label?: string
}

@injectable()
class SelectRelatorioClienteUseCase {
  constructor(@inject('RelatorioClienteRepository')
    private relatorioClienteRepository: IRelatorioClienteRepository
  ) {}

  async execute({
    filter,
  }): Promise<ResponseProps> {
    const relatoriosClientes = await this.relatorioClienteRepository.select(filter)

    const newRelatoriosClientes = {
      items: relatoriosClientes.data,
      hasNext: false
    }

    return newRelatoriosClientes
  }
}

export { SelectRelatorioClienteUseCase }
