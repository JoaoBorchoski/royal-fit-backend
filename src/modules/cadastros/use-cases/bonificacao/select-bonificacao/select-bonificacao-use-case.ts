import { inject, injectable } from 'tsyringe'
import { IBonificacaoRepository } from '@modules/cadastros/repositories/i-bonificacao-repository'

interface ResponseProps {
  items?: object[]
  hasNext?: boolean
  value?: string
  label?: string
}

@injectable()
class SelectBonificacaoUseCase {
  constructor(@inject('BonificacaoRepository')
    private bonificacaoRepository: IBonificacaoRepository
  ) {}

  async execute({
    filter,
  }): Promise<ResponseProps> {
    const bonificacoes = await this.bonificacaoRepository.select(filter)

    const newBonificacoes = {
      items: bonificacoes.data,
      hasNext: false
    }

    return newBonificacoes
  }
}

export { SelectBonificacaoUseCase }
