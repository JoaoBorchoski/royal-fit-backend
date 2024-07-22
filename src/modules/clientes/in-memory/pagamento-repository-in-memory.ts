import { IPagamentoDTO } from "@modules/clientes/dtos/i-pagamento-dto"
import { IPagamentoRepository } from "@modules/clientes/repositories/i-pagamento-repository"
import { Pagamento } from "@modules/clientes/infra/typeorm/entities/pagamento"
import { ok, notFound, HttpResponse } from "@shared/helpers"

class PagamentoRepositoryInMemory implements IPagamentoRepository {
  pagamentos: Pagamento[] = []

  // create
  async create({ clienteId, valorPago, meioPagamentoId, desabilitado }: IPagamentoDTO): Promise<HttpResponse> {
    const pagamento = new Pagamento()

    Object.assign(pagamento, {
      clienteId,
      valorPago,
      meioPagamentoId,
      desabilitado,
    })

    this.pagamentos.push(pagamento)

    return ok(pagamento)
  }

  // list
  async list(search: string, page: number, rowsPerPage: number, order: string): Promise<HttpResponse> {
    let filteredPagamentos = this.pagamentos

    filteredPagamentos = filteredPagamentos.filter((pagamento) => {
      return false
    })

    return ok(filteredPagamentos.slice((page - 1) * rowsPerPage, page * rowsPerPage))
  }

  // select
  async select(filter: string): Promise<HttpResponse> {
    let filteredPagamentos = this.pagamentos

    filteredPagamentos = filteredPagamentos.filter((pagamento) => {
      return false
    })

    return ok(filteredPagamentos)
  }

  //
  // id select
  idSelect(id: string): Promise<HttpResponse<any>> {
    throw new Error("Method not implemented.")
  }

  // count
  async count(search: string): Promise<HttpResponse> {
    let filteredPagamentos = this.pagamentos

    filteredPagamentos = filteredPagamentos.filter((pagamento) => {
      return false
    })

    return ok(filteredPagamentos.length)
  }

  // get
  async get(id: string): Promise<HttpResponse> {
    const pagamento = this.pagamentos.find((pagamento) => pagamento.id === id)

    if (typeof pagamento === "undefined") {
      return notFound()
    } else {
      return ok(pagamento)
    }
  }

  // update
  async update({ id, clienteId, valorPago, meioPagamentoId, desabilitado }: IPagamentoDTO): Promise<HttpResponse> {
    const index = this.pagamentos.findIndex((pagamento) => pagamento.id === id)

    this.pagamentos[index].clienteId = clienteId
    this.pagamentos[index].valorPago = valorPago
    this.pagamentos[index].meioPagamentoId = meioPagamentoId
    this.pagamentos[index].desabilitado = desabilitado

    return ok(this.pagamentos[index])
  }

  // delete
  async delete(id: string): Promise<HttpResponse> {
    const index = this.pagamentos.findIndex((pagamento) => pagamento.id === id)

    this.pagamentos.splice(index, 1)

    return ok(this.pagamentos)
  }

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse<any>> {
    throw new Error("Method not implemented.")
  }

  getPagamentosByDataAndCliente(dataInicio: Date, dataFim: Date, clienteId: string): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }

  getByClienteId(clienteId: string): Promise<HttpResponse> {
    throw new Error("Method not implemented.")
  }
}

export { PagamentoRepositoryInMemory }
