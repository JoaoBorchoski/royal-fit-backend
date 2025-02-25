import { inject, injectable } from 'tsyringe'
import { ICaixaRepository } from '@modules/financeiro/repositories/i-caixa-repository'

interface ResponseProps {
  items?: object[]
  hasNext?: boolean
  value?: string
  label?: string
}

@injectable()
class SelectCaixaUseCase {
  constructor(@inject('CaixaRepository')
    private caixaRepository: ICaixaRepository
  ) {}

  async execute({
    filter,
  }): Promise<ResponseProps> {
    const caixas = await this.caixaRepository.select(filter)

    const newCaixas = {
      items: caixas.data,
      hasNext: false
    }

    return newCaixas
  }
}

export { SelectCaixaUseCase }
