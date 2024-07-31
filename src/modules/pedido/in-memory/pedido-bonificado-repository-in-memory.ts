import { IPedidoBonificadoDTO } from "@modules/pedido/dtos/i-pedido-bonificado-dto"
import { IPedidoBonificadoRepository } from "@modules/pedido/repositories/i-pedido-bonificado-repository"
import { PedidoBonificado } from "@modules/pedido/infra/typeorm/entities/pedido-bonificado"
import { ok, notFound, HttpResponse } from "@shared/helpers"

class PedidoBonificadoRepositoryInMemory implements IPedidoBonificadoRepository {
  pedidoBonificados: PedidoBonificado[] = []

  // create
  async create({ clienteId, quantidade, data, isLiberado, desabilitado }: IPedidoBonificadoDTO): Promise<HttpResponse> {
    const pedidoBonificado = new PedidoBonificado()

    Object.assign(pedidoBonificado, {
      clienteId,
      quantidade,
      data,
      isLiberado,
      desabilitado,
    })

    this.pedidoBonificados.push(pedidoBonificado)

    return ok(pedidoBonificado)
  }

  // list
  async list(search: string, page: number, rowsPerPage: number, order: string): Promise<HttpResponse> {
    let filteredPedidoBonificados = this.pedidoBonificados

    filteredPedidoBonificados = filteredPedidoBonificados.filter((pedidoBonificado) => {
      return false
    })

    return ok(filteredPedidoBonificados.slice((page - 1) * rowsPerPage, page * rowsPerPage))
  }

  // select
  async select(filter: string): Promise<HttpResponse> {
    let filteredPedidoBonificados = this.pedidoBonificados

    filteredPedidoBonificados = filteredPedidoBonificados.filter((pedidoBonificado) => {
      return false
    })

    return ok(filteredPedidoBonificados)
  }

  //
  // id select
  idSelect(id: string): Promise<HttpResponse<any>> {
    throw new Error("Method not implemented.")
  }

  // count
  async count(search: string): Promise<HttpResponse> {
    let filteredPedidoBonificados = this.pedidoBonificados

    filteredPedidoBonificados = filteredPedidoBonificados.filter((pedidoBonificado) => {
      return false
    })

    return ok(filteredPedidoBonificados.length)
  }

  // get
  async get(id: string): Promise<HttpResponse> {
    const pedidoBonificado = this.pedidoBonificados.find((pedidoBonificado) => pedidoBonificado.id === id)

    if (typeof pedidoBonificado === "undefined") {
      return notFound()
    } else {
      return ok(pedidoBonificado)
    }
  }

  // update
  async update({ id, clienteId, quantidade, data, isLiberado, desabilitado }: IPedidoBonificadoDTO): Promise<HttpResponse> {
    const index = this.pedidoBonificados.findIndex((pedidoBonificado) => pedidoBonificado.id === id)

    this.pedidoBonificados[index].clienteId = clienteId
    this.pedidoBonificados[index].quantidade = quantidade
    this.pedidoBonificados[index].data = data
    this.pedidoBonificados[index].isLiberado = isLiberado
    this.pedidoBonificados[index].desabilitado = desabilitado

    return ok(this.pedidoBonificados[index])
  }

  // delete
  async delete(id: string): Promise<HttpResponse> {
    const index = this.pedidoBonificados.findIndex((pedidoBonificado) => pedidoBonificado.id === id)

    this.pedidoBonificados.splice(index, 1)

    return ok(this.pedidoBonificados)
  }

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse<any>> {
    throw new Error("Method not implemented.")
  }

  getAllByClienteIdAndData(clienteId: string, dataInicio: Date, dataFim: Date): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }
}

export { PedidoBonificadoRepositoryInMemory }
