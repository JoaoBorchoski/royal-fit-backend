import { IPedidoDTO } from "@modules/pedido/dtos/i-pedido-dto"
import { IPedidoRepository } from "@modules/pedido/repositories/i-pedido-repository"
import { Pedido } from "@modules/pedido/infra/typeorm/entities/pedido"
import { ok, notFound, HttpResponse } from "@shared/helpers"
import { EntityManager } from "typeorm"

class PedidoRepositoryInMemory implements IPedidoRepository {
  pedidos: Pedido[] = []

  // create
  async create({
    sequencial,
    clienteId,
    data,
    hora,
    valorTotal,
    desconto,
    funcionarioId,
    meioPagamentoId,
    statusPagamentoId,
    isPagamentoPosterior,
    desabilitado,
  }: IPedidoDTO): Promise<HttpResponse> {
    const pedido = new Pedido()

    Object.assign(pedido, {
      sequencial,
      clienteId,
      data,
      hora,
      valorTotal,
      desconto,
      funcionarioId,
      meioPagamentoId,
      statusPagamentoId,
      isPagamentoPosterior,
      desabilitado,
    })

    this.pedidos.push(pedido)

    return ok(pedido)
  }

  createWithQueryRunner(
    {
      sequencial,
      clienteId,
      data,
      hora,
      valorTotal,
      desconto,
      funcionarioId,
      meioPagamentoId,
      statusPagamentoId,
      isPagamentoPosterior,
      desabilitado,
    }: IPedidoDTO,
    transactionManager: EntityManager
  ): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }

  // list
  async list(search: string, page: number, rowsPerPage: number, order: string): Promise<HttpResponse> {
    let filteredPedidos = this.pedidos

    filteredPedidos = filteredPedidos.filter((pedido) => {
      return false
    })

    return ok(filteredPedidos.slice((page - 1) * rowsPerPage, page * rowsPerPage))
  }

  // select
  async select(filter: string): Promise<HttpResponse> {
    let filteredPedidos = this.pedidos

    filteredPedidos = filteredPedidos.filter((pedido) => {
      return false
    })

    return ok(filteredPedidos)
  }

  //
  // id select
  idSelect(id: string): Promise<HttpResponse<any>> {
    throw new Error("Method not implemented.")
  }

  // count
  async count(search: string): Promise<HttpResponse> {
    let filteredPedidos = this.pedidos

    filteredPedidos = filteredPedidos.filter((pedido) => {
      return false
    })

    return ok(filteredPedidos.length)
  }

  // get
  async get(id: string): Promise<HttpResponse> {
    const pedido = this.pedidos.find((pedido) => pedido.id === id)

    if (typeof pedido === "undefined") {
      return notFound()
    } else {
      return ok(pedido)
    }
  }

  // update
  countWithQueryRunner(search: string, filter: string, transactionManager: EntityManager): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }

  // update
  update(
    {
      id,
      sequencial,
      clienteId,
      data,
      hora,
      valorTotal,
      desconto,
      funcionarioId,
      meioPagamentoId,
      statusPagamentoId,
      isPagamentoPosterior,
      desabilitado,
    }: IPedidoDTO,
    transactionManager: EntityManager
  ): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }

  // delete
  async delete(id: string): Promise<HttpResponse> {
    const index = this.pedidos.findIndex((pedido) => pedido.id === id)

    this.pedidos.splice(index, 1)

    return ok(this.pedidos)
  }

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse<any>> {
    throw new Error("Method not implemented.")
  }

  getPedidosByDataAndCliente(dataInicio: Date, dataFim: Date, clienteId: string): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }

  getByClienteId(clienteId: string): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }
}

export { PedidoRepositoryInMemory }
