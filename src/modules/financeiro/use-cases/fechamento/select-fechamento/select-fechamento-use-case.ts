import { inject, injectable } from 'tsyringe'
import { IFechamentoRepository } from '@modules/financeiro/repositories/i-fechamento-repository'

interface ResponseProps {
  items?: object[]
  hasNext?: boolean
  value?: string
  label?: string
}

@injectable()
class SelectFechamentoUseCase {
  constructor(@inject('FechamentoRepository')
    private fechamentoRepository: IFechamentoRepository
  ) {}

  async execute({
    filter,
  }): Promise<ResponseProps> {
    const fechamentos = await this.fechamentoRepository.select(filter)

    const newFechamentos = {
      items: fechamentos.data,
      hasNext: false
    }

    return newFechamentos
  }
}

export { SelectFechamentoUseCase }
