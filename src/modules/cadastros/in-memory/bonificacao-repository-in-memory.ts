import { IBonificacaoDTO } from "@modules/cadastros/dtos/i-bonificacao-dto"
import { IBonificacaoRepository } from "@modules/cadastros/repositories/i-bonificacao-repository"
import { Bonificacao } from "@modules/cadastros/infra/typeorm/entities/bonificacao"
import { ok, notFound, HttpResponse } from "@shared/helpers"
import { EntityManager } from "typeorm"

class BonificacaoRepositoryInMemory implements IBonificacaoRepository {
  bonificacoes: Bonificacao[] = []

  // create
  async create({ clienteId, totalVendido, bonificacaoDisponivel, desabilitado }: IBonificacaoDTO): Promise<HttpResponse> {
    const bonificacao = new Bonificacao()

    Object.assign(bonificacao, {
      clienteId,
      totalVendido,
      bonificacaoDisponivel,
      desabilitado,
    })

    this.bonificacoes.push(bonificacao)

    return ok(bonificacao)
  }
  createWithQueryRunner(
    { clienteId, totalVendido, bonificacaoDisponivel, desabilitado }: IBonificacaoDTO,
    transactionManager: EntityManager
  ): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }

  // list
  async list(search: string, page: number, rowsPerPage: number, order: string): Promise<HttpResponse> {
    let filteredBonificacoes = this.bonificacoes

    filteredBonificacoes = filteredBonificacoes.filter((bonificacao) => {
      return false
    })

    return ok(filteredBonificacoes.slice((page - 1) * rowsPerPage, page * rowsPerPage))
  }

  // select
  async select(filter: string): Promise<HttpResponse> {
    let filteredBonificacoes = this.bonificacoes

    filteredBonificacoes = filteredBonificacoes.filter((bonificacao) => {
      return false
    })

    return ok(filteredBonificacoes)
  }

  //
  // id select
  idSelect(id: string): Promise<HttpResponse<any>> {
    throw new Error("Method not implemented.")
  }

  // count
  async count(search: string): Promise<HttpResponse> {
    let filteredBonificacoes = this.bonificacoes

    filteredBonificacoes = filteredBonificacoes.filter((bonificacao) => {
      return false
    })

    return ok(filteredBonificacoes.length)
  }

  // get
  async get(id: string): Promise<HttpResponse> {
    const bonificacao = this.bonificacoes.find((bonificacao) => bonificacao.id === id)

    if (typeof bonificacao === "undefined") {
      return notFound()
    } else {
      return ok(bonificacao)
    }
  }

  getByClienteId(clienteId: string): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }

  // update
  async update({ id, clienteId, totalVendido, bonificacaoDisponivel, desabilitado }: IBonificacaoDTO): Promise<HttpResponse> {
    const index = this.bonificacoes.findIndex((bonificacao) => bonificacao.id === id)

    this.bonificacoes[index].clienteId = clienteId
    this.bonificacoes[index].totalVendido = totalVendido
    this.bonificacoes[index].bonificacaoDisponivel = bonificacaoDisponivel
    this.bonificacoes[index].desabilitado = desabilitado

    return ok(this.bonificacoes[index])
  }

  // delete
  async delete(id: string): Promise<HttpResponse> {
    const index = this.bonificacoes.findIndex((bonificacao) => bonificacao.id === id)

    this.bonificacoes.splice(index, 1)

    return ok(this.bonificacoes)
  }

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse<any>> {
    throw new Error("Method not implemented.")
  }
}

export { BonificacaoRepositoryInMemory }
