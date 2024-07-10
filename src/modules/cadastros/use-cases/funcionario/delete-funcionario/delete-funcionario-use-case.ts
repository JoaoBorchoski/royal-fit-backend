import { inject, injectable } from 'tsyringe'
import { Funcionario } from '@modules/cadastros/infra/typeorm/entities/funcionario'
import { IFuncionarioRepository } from '@modules/cadastros/repositories/i-funcionario-repository'
import { HttpResponse } from '@shared/helpers'

@injectable()
class DeleteFuncionarioUseCase {
  constructor(@inject('FuncionarioRepository')
    private funcionarioRepository: IFuncionarioRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const funcionario = await this.funcionarioRepository.delete(id)

    return funcionario
  }
}

export { DeleteFuncionarioUseCase }
