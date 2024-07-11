import { inject, injectable } from "tsyringe"
import { ICidadeRepository } from "@modules/comum/repositories/i-cidade-repository"

@injectable()
class NameSelectCidadeUseCase {
  constructor(
    @inject("CidadeRepository")
    private cidadeRepository: ICidadeRepository
  ) {}

  async execute({ name }) {
    const cidade = await this.cidadeRepository.nameSelect(name)

    return cidade
  }
}

export { NameSelectCidadeUseCase }
