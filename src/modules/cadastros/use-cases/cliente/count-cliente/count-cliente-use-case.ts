import { inject, injectable } from 'tsyringe'
import { Cliente } from '@modules/cadastros/infra/typeorm/entities/cliente'
import { IClienteRepository } from '@modules/cadastros/repositories/i-cliente-repository'
import { HttpResponse } from '@shared/helpers'

interface IRequest {
  search: string,
  filter?: string
}

@injectable()
class CountClienteUseCase {
  constructor(@inject('ClienteRepository')
    private clienteRepository: IClienteRepository
  ) {}

  async execute({
    search,
    filter
  }: IRequest): Promise<HttpResponse> {
    const clientesCount = await this.clienteRepository.count(
      search,
      filter
    )

    return clientesCount
  }
}

export { CountClienteUseCase }
