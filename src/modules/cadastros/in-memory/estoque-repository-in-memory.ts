import { IEstoqueDTO } from "@modules/cadastros/dtos/i-estoque-dto"
import { IEstoqueRepository } from "@modules/cadastros/repositories/i-estoque-repository"
import { Estoque } from "@modules/cadastros/infra/typeorm/entities/estoque"
import { ok, notFound, HttpResponse } from "@shared/helpers"
import { EntityManager } from "typeorm"

class EstoqueRepositoryInMemory implements IEstoqueRepository {
  estoques: Estoque[] = []

  // create
  async create({ produtoId, quantidade, desabilitado }: IEstoqueDTO): Promise<HttpResponse> {
    const estoque = new Estoque()

    Object.assign(estoque, {
      produtoId,
      quantidade,
      desabilitado,
    })

    this.estoques.push(estoque)

    return ok(estoque)
  }

  createWithQueryRunner(
    { produtoId, quantidade, desabilitado }: IEstoqueDTO,
    transactionManager: EntityManager
  ): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }

  getByProdutoId(produtoId: string): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }

  updateEstoqueQuantidade(id: string, quantidade: number, transactionManager: EntityManager): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }

  // list
  async list(search: string, page: number, rowsPerPage: number, order: string): Promise<HttpResponse> {
    let filteredEstoques = this.estoques

    filteredEstoques = filteredEstoques.filter((estoque) => {
      return false
    })

    return ok(filteredEstoques.slice((page - 1) * rowsPerPage, page * rowsPerPage))
  }

  // select
  async select(filter: string): Promise<HttpResponse> {
    let filteredEstoques = this.estoques

    filteredEstoques = filteredEstoques.filter((estoque) => {
      return false
    })

    return ok(filteredEstoques)
  }

  //
  // id select
  idSelect(id: string): Promise<HttpResponse<any>> {
    throw new Error("Method not implemented.")
  }

  // count
  async count(search: string): Promise<HttpResponse> {
    let filteredEstoques = this.estoques

    filteredEstoques = filteredEstoques.filter((estoque) => {
      return false
    })

    return ok(filteredEstoques.length)
  }

  // get
  async get(id: string): Promise<HttpResponse> {
    const estoque = this.estoques.find((estoque) => estoque.id === id)

    if (typeof estoque === "undefined") {
      return notFound()
    } else {
      return ok(estoque)
    }
  }

  // update
  async update({ id, produtoId, quantidade, desabilitado }: IEstoqueDTO): Promise<HttpResponse> {
    const index = this.estoques.findIndex((estoque) => estoque.id === id)

    this.estoques[index].produtoId = produtoId
    this.estoques[index].quantidade = quantidade
    this.estoques[index].desabilitado = desabilitado

    return ok(this.estoques[index])
  }

  // delete
  async delete(id: string): Promise<HttpResponse> {
    const index = this.estoques.findIndex((estoque) => estoque.id === id)

    this.estoques.splice(index, 1)

    return ok(this.estoques)
  }

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse<any>> {
    throw new Error("Method not implemented.")
  }
}

export { EstoqueRepositoryInMemory }
