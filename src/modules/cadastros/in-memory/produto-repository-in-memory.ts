import { IProdutoDTO } from "@modules/cadastros/dtos/i-produto-dto"
import { IProdutoRepository } from "@modules/cadastros/repositories/i-produto-repository"
import { Produto } from "@modules/cadastros/infra/typeorm/entities/produto"
import { ok, notFound, HttpResponse } from "@shared/helpers"
import { EntityManager } from "typeorm"

class ProdutoRepositoryInMemory implements IProdutoRepository {
  produtos: Produto[] = []

  // create
  async create({ nome, preco, descricao, desabilitado }: IProdutoDTO): Promise<HttpResponse> {
    const produto = new Produto()

    Object.assign(produto, {
      nome,
      preco,
      descricao,
      desabilitado,
    })

    this.produtos.push(produto)

    return ok(produto)
  }

  createWithQueryRunner(
    { nome, preco, descricao, desabilitado }: IProdutoDTO,
    transactionManager: EntityManager
  ): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }

  getByname(nome: string): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }

  // list
  async list(search: string, page: number, rowsPerPage: number, order: string): Promise<HttpResponse> {
    let filteredProdutos = this.produtos

    filteredProdutos = filteredProdutos.filter((produto) => {
      if (produto.nome.includes(search)) return true
      if (produto.descricao.includes(search)) return true

      return false
    })

    return ok(filteredProdutos.slice((page - 1) * rowsPerPage, page * rowsPerPage))
  }

  // select
  async select(filter: string): Promise<HttpResponse> {
    let filteredProdutos = this.produtos

    filteredProdutos = filteredProdutos.filter((produto) => {
      if (produto.nome.includes(filter)) return true
      if (produto.descricao.includes(filter)) return true

      return false
    })

    return ok(filteredProdutos)
  }

  //
  // id select
  idSelect(id: string): Promise<HttpResponse<any>> {
    throw new Error("Method not implemented.")
  }

  // count
  async count(search: string): Promise<HttpResponse> {
    let filteredProdutos = this.produtos

    filteredProdutos = filteredProdutos.filter((produto) => {
      if (produto.nome.includes(search)) return true
      if (produto.descricao.includes(search)) return true

      return false
    })

    return ok(filteredProdutos.length)
  }

  // get
  async get(id: string): Promise<HttpResponse> {
    const produto = this.produtos.find((produto) => produto.id === id)

    if (typeof produto === "undefined") {
      return notFound()
    } else {
      return ok(produto)
    }
  }

  // update
  async update({ id, nome, preco, descricao, desabilitado }: IProdutoDTO): Promise<HttpResponse> {
    const index = this.produtos.findIndex((produto) => produto.id === id)

    this.produtos[index].nome = nome
    this.produtos[index].preco = preco
    this.produtos[index].descricao = descricao
    this.produtos[index].desabilitado = desabilitado

    return ok(this.produtos[index])
  }

  // delete
  async delete(id: string): Promise<HttpResponse> {
    const index = this.produtos.findIndex((produto) => produto.id === id)

    this.produtos.splice(index, 1)

    return ok(this.produtos)
  }

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse<any>> {
    throw new Error("Method not implemented.")
  }
}

export { ProdutoRepositoryInMemory }
