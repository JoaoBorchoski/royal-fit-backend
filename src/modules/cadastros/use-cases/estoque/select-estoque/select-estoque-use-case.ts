import { inject, injectable } from 'tsyringe'
import { IEstoqueRepository } from '@modules/cadastros/repositories/i-estoque-repository'

interface ResponseProps {
  items?: object[]
  hasNext?: boolean
  value?: string
  label?: string
}

@injectable()
class SelectEstoqueUseCase {
  constructor(@inject('EstoqueRepository')
    private estoqueRepository: IEstoqueRepository
  ) {}

  async execute({
    filter,
  }): Promise<ResponseProps> {
    const estoques = await this.estoqueRepository.select(filter)

    const newEstoques = {
      items: estoques.data,
      hasNext: false
    }

    return newEstoques
  }
}

export { SelectEstoqueUseCase }
