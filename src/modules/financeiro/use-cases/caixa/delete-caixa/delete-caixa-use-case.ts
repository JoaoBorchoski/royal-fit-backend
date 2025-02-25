import { inject, injectable } from 'tsyringe'
import { Caixa } from '@modules/financeiro/infra/typeorm/entities/caixa'
import { ICaixaRepository } from '@modules/financeiro/repositories/i-caixa-repository'
import { HttpResponse } from '@shared/helpers'

@injectable()
class DeleteCaixaUseCase {
  constructor(@inject('CaixaRepository')
    private caixaRepository: ICaixaRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const caixa = await this.caixaRepository.delete(id)

    return caixa
  }
}

export { DeleteCaixaUseCase }
