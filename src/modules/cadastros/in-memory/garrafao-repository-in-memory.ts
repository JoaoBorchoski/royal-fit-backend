import { IGarrafaoDTO } from "@modules/cadastros/dtos/i-garrafao-dto"
import { IGarrafaoRepository } from "@modules/cadastros/repositories/i-garrafao-repository"
import { Garrafao } from "@modules/cadastros/infra/typeorm/entities/garrafao"
import { ok, notFound, HttpResponse } from "@shared/helpers"
import { EntityManager } from "typeorm"

class GarrafaoRepositoryInMemory implements IGarrafaoRepository {
  garrafoes: Garrafao[] = []

  // create
  async create({ clienteId, quantidade, desabilitado }: IGarrafaoDTO): Promise<HttpResponse> {
    const garrafao = new Garrafao()

    Object.assign(garrafao, {
      clienteId,
      quantidade,
      desabilitado,
    })

    this.garrafoes.push(garrafao)

    return ok(garrafao)
  }

  createWithQueryRunner(
    { clienteId, quantidade, desabilitado }: IGarrafaoDTO,
    transactionManager: EntityManager
  ): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }

  // list
  async list(search: string, page: number, rowsPerPage: number, order: string): Promise<HttpResponse> {
    let filteredGarrafoes = this.garrafoes

    filteredGarrafoes = filteredGarrafoes.filter((garrafao) => {
      return false
    })

    return ok(filteredGarrafoes.slice((page - 1) * rowsPerPage, page * rowsPerPage))
  }

  // select
  async select(filter: string): Promise<HttpResponse> {
    let filteredGarrafoes = this.garrafoes

    filteredGarrafoes = filteredGarrafoes.filter((garrafao) => {
      return false
    })

    return ok(filteredGarrafoes)
  }

  //
  // id select
  idSelect(id: string): Promise<HttpResponse<any>> {
    throw new Error("Method not implemented.")
  }

  // count
  async count(search: string): Promise<HttpResponse> {
    let filteredGarrafoes = this.garrafoes

    filteredGarrafoes = filteredGarrafoes.filter((garrafao) => {
      return false
    })

    return ok(filteredGarrafoes.length)
  }

  // get
  async get(id: string): Promise<HttpResponse> {
    const garrafao = this.garrafoes.find((garrafao) => garrafao.id === id)

    if (typeof garrafao === "undefined") {
      return notFound()
    } else {
      return ok(garrafao)
    }
  }

  // update
  async update({ id, clienteId, quantidade, desabilitado }: IGarrafaoDTO): Promise<HttpResponse> {
    const index = this.garrafoes.findIndex((garrafao) => garrafao.id === id)

    this.garrafoes[index].clienteId = clienteId
    this.garrafoes[index].quantidade = quantidade
    this.garrafoes[index].desabilitado = desabilitado

    return ok(this.garrafoes[index])
  }

  // delete
  async delete(id: string): Promise<HttpResponse> {
    const index = this.garrafoes.findIndex((garrafao) => garrafao.id === id)

    this.garrafoes.splice(index, 1)

    return ok(this.garrafoes)
  }

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse<any>> {
    throw new Error("Method not implemented.")
  }
}

export { GarrafaoRepositoryInMemory }
