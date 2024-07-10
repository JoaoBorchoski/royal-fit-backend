import { IRelatorioClienteDTO } from '@modules/relatorios/dtos/i-relatorio-cliente-dto'
import { IRelatorioClienteRepository } from '@modules/relatorios/repositories/i-relatorio-cliente-repository'
import { RelatorioCliente } from '@modules/relatorios/infra/typeorm/entities/relatorio-cliente'
import { ok, notFound, HttpResponse } from '@shared/helpers'

class RelatorioClienteRepositoryInMemory implements IRelatorioClienteRepository {
  relatoriosClientes: RelatorioCliente[] = []

  // create
  async create ({
    clienteId,
    dataInicio,
    dataFim,
    relatório,
    desabilitado
  }: IRelatorioClienteDTO): Promise<HttpResponse> {
    const relatorioCliente = new RelatorioCliente()

    Object.assign(relatorioCliente, {
      clienteId,
      dataInicio,
      dataFim,
      relatório,
      desabilitado
    })

    this.relatoriosClientes.push(relatorioCliente)

    return ok(relatorioCliente)
  }


  // list
  async list (
    search: string,
    page: number,
    rowsPerPage: number,
    order: string
  ): Promise<HttpResponse> {
    let filteredRelatoriosClientes = this.relatoriosClientes

    filteredRelatoriosClientes = filteredRelatoriosClientes.filter((relatorioCliente) => {

      return false
    })

    return ok(filteredRelatoriosClientes.slice((page - 1) * rowsPerPage, page * rowsPerPage))
  }


  // select
  async select (filter: string): Promise<HttpResponse> {
    let filteredRelatoriosClientes = this.relatoriosClientes

    filteredRelatoriosClientes = filteredRelatoriosClientes.filter((relatorioCliente) => {

      return false
    })

    return ok(filteredRelatoriosClientes)
  }


  //
  // id select
  idSelect(id: string): Promise<HttpResponse<any>> {
    throw new Error('Method not implemented.')
  }


  // count
  async count (search: string,): Promise<HttpResponse> {
    let filteredRelatoriosClientes = this.relatoriosClientes

    filteredRelatoriosClientes = filteredRelatoriosClientes.filter((relatorioCliente) => {

      return false
    })

    return ok(filteredRelatoriosClientes.length)
  }


  // get
  async get (id: string): Promise<HttpResponse> {
    const relatorioCliente = this.relatoriosClientes.find((relatorioCliente) => relatorioCliente.id === id)

    if (typeof relatorioCliente === 'undefined') {
      return notFound()
    } else {
      return ok(relatorioCliente)
    }
  }


  // update
  async update ({
    id,
    clienteId,
    dataInicio,
    dataFim,
    relatório,
    desabilitado
  }: IRelatorioClienteDTO): Promise<HttpResponse> {
    const index = this.relatoriosClientes.findIndex((relatorioCliente) => relatorioCliente.id === id)

    this.relatoriosClientes[index].clienteId = clienteId
    this.relatoriosClientes[index].dataInicio = dataInicio
    this.relatoriosClientes[index].dataFim = dataFim
    this.relatoriosClientes[index].relatório = relatório
    this.relatoriosClientes[index].desabilitado = desabilitado

    return ok(this.relatoriosClientes[index])
  }


  // delete
  async delete (id: string): Promise<HttpResponse> {
    const index = this.relatoriosClientes.findIndex((relatorioCliente) => relatorioCliente.id === id)

    this.relatoriosClientes.splice(index, 1)

    return ok(this.relatoriosClientes)
  }


  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse<any>> {
    throw new Error('Method not implemented.')
  }
}

export { RelatorioClienteRepositoryInMemory }
