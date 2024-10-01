import { inject, injectable } from 'tsyringe'
import { IDescontoRepository } from '@modules/clientes/repositories/i-desconto-repository'

interface ResponseProps {
  items?: object[]
  hasNext?: boolean
  value?: string
  label?: string
}

@injectable()
class SelectDescontoUseCase {
  constructor(@inject('DescontoRepository')
    private descontoRepository: IDescontoRepository
  ) {}

  async execute({
    filter,
  }): Promise<ResponseProps> {
    const descontos = await this.descontoRepository.select(filter)

    const newDescontos = {
      items: descontos.data,
      hasNext: false
    }

    return newDescontos
  }
}

export { SelectDescontoUseCase }
