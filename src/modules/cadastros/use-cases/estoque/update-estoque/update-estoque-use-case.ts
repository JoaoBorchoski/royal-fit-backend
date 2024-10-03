import { inject, injectable } from "tsyringe"
import { Estoque } from "@modules/cadastros/infra/typeorm/entities/estoque"
import { IEstoqueRepository } from "@modules/cadastros/repositories/i-estoque-repository"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse } from "@shared/helpers"

interface IRequest {
  id: string
  produtoId: string
  quantidade: number
  desabilitado: boolean
}

@injectable()
class UpdateEstoqueUseCase {
  constructor(
    @inject("EstoqueRepository")
    private estoqueRepository: IEstoqueRepository
  ) {}

  async execute({ id, produtoId, quantidade, desabilitado }: IRequest): Promise<HttpResponse> {
    const oldEstoque = await this.estoqueRepository.get(id)

    const estoque = await this.estoqueRepository.update({
      id,
      produtoId,
      quantidade,
      desabilitado,
    })

    const produtoEstoqueMap: { [key: string]: string } = {
      "1a1193c9-0ff4-4d1c-95b3-8a9c8bc9334b": "c2937440-e5b3-4bd0-a8fe-6ed15cb98178", // 510 Sem Gás
      "17239db9-cbce-487f-9703-e700b5d3cc42": "e15fc18b-9dee-4924-b796-22bee0d7003f", // 500 Com Gás
      "4c652b29-b73d-4148-8015-5055cfdd8adc": "c3293421-7be0-4b6f-ba26-4a03807a5e4e", // 1500 Sem Gás
      "906b4eb8-7fa7-41c3-88f1-b826048ebf31": "4043d53b-55e9-4a4d-9d15-c681eb3950a1", // 5L Descartável
      "28f4726e-db0f-4d48-88a0-64f0ec4d697b": "0c85d977-9259-4a73-8788-f33e6f1cc1d0", // 10L Descartavel
      "33367833-9fc0-4e17-af4e-a835d9edc3be": "f0a44624-9add-4182-98c7-e1cb7aac2629", // Caixa de Copo
    }

    if (produtoId in produtoEstoqueMap) {
      let quantidadeDiferenca = quantidade - oldEstoque.data.quantidade

      const fatorMultiplicacao: { [key: string]: number } = {
        "4c652b29-b73d-4148-8015-5055cfdd8adc": 6,
        "1a1193c9-0ff4-4d1c-95b3-8a9c8bc9334b": 12,
        "17239db9-cbce-487f-9703-e700b5d3cc42": 12,
        "33367833-9fc0-4e17-af4e-a835d9edc3be": 48,
      }

      if (produtoId in fatorMultiplicacao) {
        quantidadeDiferenca *= fatorMultiplicacao[produtoId]
      }

      const estoqueId = produtoEstoqueMap[produtoId]
      const est = await this.estoqueRepository.get(estoqueId)

      const novaQuantidade = Math.max(est.data.quantidade - quantidadeDiferenca, 0)
      await this.estoqueRepository.update({
        id: est.data.id,
        quantidade: novaQuantidade,
      })
    }

    return estoque
  }
}

export { UpdateEstoqueUseCase }
