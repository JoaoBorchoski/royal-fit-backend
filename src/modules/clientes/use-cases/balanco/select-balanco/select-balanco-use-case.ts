import { inject, injectable } from 'tsyringe'
import { IBalancoRepository } from '@modules/clientes/repositories/i-balanco-repository'

interface ResponseProps {
  items?: object[]
  hasNext?: boolean
  value?: string
  label?: string
}

@injectable()
class SelectBalancoUseCase {
  constructor(@inject('BalancoRepository')
    private balancoRepository: IBalancoRepository
  ) {}

  async execute({
    filter,
  }): Promise<ResponseProps> {
    const balancos = await this.balancoRepository.select(filter)

    const newBalancos = {
      items: balancos.data,
      hasNext: false
    }

    return newBalancos
  }
}

export { SelectBalancoUseCase }
