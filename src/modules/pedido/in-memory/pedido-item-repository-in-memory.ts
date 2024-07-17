import { IPedidoItemDTO } from "@modules/pedido/dtos/i-pedido-item-dto"
import { IPedidoItemRepository } from "@modules/pedido/repositories/i-pedido-item-repository"
import { PedidoItem } from "@modules/pedido/infra/typeorm/entities/pedido-item"
import { ok, notFound, HttpResponse } from "@shared/helpers"
import { EntityManager } from "typeorm"

class PedidoItemRepositoryInMemory implements IPedidoItemRepository {
  pedidoItens: PedidoItem[] = []

  // create
  async create({ produtoId, pedidoId, quantidade, desabilitado }: IPedidoItemDTO): Promise<HttpResponse> {
    const pedidoItem = new PedidoItem()

    Object.assign(pedidoItem, {
      produtoId,
      pedidoId,
      quantidade,
      desabilitado,
    })

    this.pedidoItens.push(pedidoItem)

    return ok(pedidoItem)
  }

  createWithQueryRunner(
    { produtoId, pedidoId, quantidade, desabilitado }: IPedidoItemDTO,
    transactionManager: EntityManager
  ): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }

  getByPedidoIdAndProdutoId(pedidoId: string, produtoId: string): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }

  // update
  update(
    { id, produtoId, pedidoId, quantidade, desabilitado }: IPedidoItemDTO,
    transactionManager: EntityManager
  ): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }

  deleteByPedidoId(pedidoId: string): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }

  // list
  async list(search: string, page: number, rowsPerPage: number, order: string): Promise<HttpResponse> {
    let filteredPedidoItens = this.pedidoItens

    filteredPedidoItens = filteredPedidoItens.filter((pedidoItem) => {
      return false
    })

    return ok(filteredPedidoItens.slice((page - 1) * rowsPerPage, page * rowsPerPage))
  }

  // select
  async select(filter: string): Promise<HttpResponse> {
    let filteredPedidoItens = this.pedidoItens

    filteredPedidoItens = filteredPedidoItens.filter((pedidoItem) => {
      return false
    })

    return ok(filteredPedidoItens)
  }

  //
  // id select
  idSelect(id: string): Promise<HttpResponse<any>> {
    throw new Error("Method not implemented.")
  }

  // count
  async count(search: string): Promise<HttpResponse> {
    let filteredPedidoItens = this.pedidoItens

    filteredPedidoItens = filteredPedidoItens.filter((pedidoItem) => {
      return false
    })

    return ok(filteredPedidoItens.length)
  }

  // get
  async get(id: string): Promise<HttpResponse> {
    const pedidoItem = this.pedidoItens.find((pedidoItem) => pedidoItem.id === id)

    if (typeof pedidoItem === "undefined") {
      return notFound()
    } else {
      return ok(pedidoItem)
    }
  }

  // delete
  async delete(id: string): Promise<HttpResponse> {
    const index = this.pedidoItens.findIndex((pedidoItem) => pedidoItem.id === id)

    this.pedidoItens.splice(index, 1)

    return ok(this.pedidoItens)
  }

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse<any>> {
    throw new Error("Method not implemented.")
  }
}

export { PedidoItemRepositoryInMemory }
