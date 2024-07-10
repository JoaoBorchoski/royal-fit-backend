import { IPedidoDTO } from '@modules/pedido/dtos/i-pedido-dto'
import { IPedidoRepository } from '@modules/pedido/repositories/i-pedido-repository'
import { Pedido } from '@modules/pedido/infra/typeorm/entities/pedido'
import { ok, notFound, HttpResponse } from '@shared/helpers'

class PedidoRepositoryInMemory implements IPedidoRepository {
  pedidos: Pedido[] = []

  // create
  async create ({
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
    desabilitado
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
      desabilitado
    })

    this.pedidos.push(pedido)

    return ok(pedido)
  }


  // list
  async list (
    search: string,
    page: number,
    rowsPerPage: number,
    order: string
  ): Promise<HttpResponse> {
    let filteredPedidos = this.pedidos

    filteredPedidos = filteredPedidos.filter((pedido) => {

      return false
    })

    return ok(filteredPedidos.slice((page - 1) * rowsPerPage, page * rowsPerPage))
  }


  // select
  async select (filter: string): Promise<HttpResponse> {
    let filteredPedidos = this.pedidos

    filteredPedidos = filteredPedidos.filter((pedido) => {

      return false
    })

    return ok(filteredPedidos)
  }


  //
  // id select
  idSelect(id: string): Promise<HttpResponse<any>> {
    throw new Error('Method not implemented.')
  }


  // count
  async count (search: string,): Promise<HttpResponse> {
    let filteredPedidos = this.pedidos

    filteredPedidos = filteredPedidos.filter((pedido) => {

      return false
    })

    return ok(filteredPedidos.length)
  }


  // get
  async get (id: string): Promise<HttpResponse> {
    const pedido = this.pedidos.find((pedido) => pedido.id === id)

    if (typeof pedido === 'undefined') {
      return notFound()
    } else {
      return ok(pedido)
    }
  }


  // update
  async update ({
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
    desabilitado
  }: IPedidoDTO): Promise<HttpResponse> {
    const index = this.pedidos.findIndex((pedido) => pedido.id === id)

    this.pedidos[index].sequencial = sequencial
    this.pedidos[index].clienteId = clienteId
    this.pedidos[index].data = data
    this.pedidos[index].hora = hora
    this.pedidos[index].valorTotal = valorTotal
    this.pedidos[index].desconto = desconto
    this.pedidos[index].funcionarioId = funcionarioId
    this.pedidos[index].meioPagamentoId = meioPagamentoId
    this.pedidos[index].statusPagamentoId = statusPagamentoId
    this.pedidos[index].isPagamentoPosterior = isPagamentoPosterior
    this.pedidos[index].desabilitado = desabilitado

    return ok(this.pedidos[index])
  }


  // delete
  async delete (id: string): Promise<HttpResponse> {
    const index = this.pedidos.findIndex((pedido) => pedido.id === id)

    this.pedidos.splice(index, 1)

    return ok(this.pedidos)
  }


  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse<any>> {
    throw new Error('Method not implemented.')
  }
}

export { PedidoRepositoryInMemory }
