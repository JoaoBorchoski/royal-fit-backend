import { IBalancoDTO } from "@modules/clientes/dtos/i-balanco-dto"
import { IBalancoRepository } from "@modules/clientes/repositories/i-balanco-repository"
import { Balanco } from "@modules/clientes/infra/typeorm/entities/balanco"
import { ok, notFound, HttpResponse } from "@shared/helpers"
import { EntityManager } from "typeorm"

class BalancoRepositoryInMemory implements IBalancoRepository {
  balancos: Balanco[] = []

  // create
  async create({ clienteId, saldoDevedor, desabilitado }: IBalancoDTO): Promise<HttpResponse> {
    const balanco = new Balanco()

    Object.assign(balanco, {
      clienteId,
      saldoDevedor,
      desabilitado,
    })

    this.balancos.push(balanco)

    return ok(balanco)
  }

  createWithQueryRunner(
    { clienteId, saldoDevedor, desabilitado }: IBalancoDTO,
    transactionManager: EntityManager
  ): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }

  // list
  async list(search: string, page: number, rowsPerPage: number, order: string): Promise<HttpResponse> {
    let filteredBalancos = this.balancos

    filteredBalancos = filteredBalancos.filter((balanco) => {
      return false
    })

    return ok(filteredBalancos.slice((page - 1) * rowsPerPage, page * rowsPerPage))
  }

  // select
  async select(filter: string): Promise<HttpResponse> {
    let filteredBalancos = this.balancos

    filteredBalancos = filteredBalancos.filter((balanco) => {
      return false
    })

    return ok(filteredBalancos)
  }

  //
  // id select
  idSelect(id: string): Promise<HttpResponse<any>> {
    throw new Error("Method not implemented.")
  }

  // count
  async count(search: string): Promise<HttpResponse> {
    let filteredBalancos = this.balancos

    filteredBalancos = filteredBalancos.filter((balanco) => {
      return false
    })

    return ok(filteredBalancos.length)
  }

  // get
  async get(id: string): Promise<HttpResponse> {
    const balanco = this.balancos.find((balanco) => balanco.id === id)

    if (typeof balanco === "undefined") {
      return notFound()
    } else {
      return ok(balanco)
    }
  }

  getByClienteId(clienteId: string): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }

  getByClienteIdWithQueryRunner(clienteId: string, transactionManager: EntityManager): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }

  // update
  async update({ id, clienteId, saldoDevedor, desabilitado }: IBalancoDTO): Promise<HttpResponse> {
    const index = this.balancos.findIndex((balanco) => balanco.id === id)

    this.balancos[index].clienteId = clienteId
    this.balancos[index].saldoDevedor = saldoDevedor
    this.balancos[index].desabilitado = desabilitado

    return ok(this.balancos[index])
  }

  updateWithQueryRunner(
    { id, clienteId, saldoDevedor, desabilitado }: IBalancoDTO,
    transactionManager: EntityManager
  ): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }

  // delete
  async delete(id: string): Promise<HttpResponse> {
    const index = this.balancos.findIndex((balanco) => balanco.id === id)

    this.balancos.splice(index, 1)

    return ok(this.balancos)
  }

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse<any>> {
    throw new Error("Method not implemented.")
  }
}

export { BalancoRepositoryInMemory }
