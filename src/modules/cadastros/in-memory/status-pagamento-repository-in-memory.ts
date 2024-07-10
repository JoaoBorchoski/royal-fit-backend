import { IStatusPagamentoDTO } from '@modules/cadastros/dtos/i-status-pagamento-dto'
import { IStatusPagamentoRepository } from '@modules/cadastros/repositories/i-status-pagamento-repository'
import { StatusPagamento } from '@modules/cadastros/infra/typeorm/entities/status-pagamento'
import { ok, notFound, HttpResponse } from '@shared/helpers'

class StatusPagamentoRepositoryInMemory implements IStatusPagamentoRepository {
  statusPagamento: StatusPagamento[] = []

  // create
  async create ({
    nome,
    descricao,
    desabilitado
  }: IStatusPagamentoDTO): Promise<HttpResponse> {
    const statusPagamento = new StatusPagamento()

    Object.assign(statusPagamento, {
      nome,
      descricao,
      desabilitado
    })

    this.statusPagamento.push(statusPagamento)

    return ok(statusPagamento)
  }


  // list
  async list (
    search: string,
    page: number,
    rowsPerPage: number,
    order: string
  ): Promise<HttpResponse> {
    let filteredStatusPagamento = this.statusPagamento

    filteredStatusPagamento = filteredStatusPagamento.filter((statusPagamento) => {
      if (statusPagamento.nome.includes(search)) return true
      if (statusPagamento.descricao.includes(search)) return true

      return false
    })

    return ok(filteredStatusPagamento.slice((page - 1) * rowsPerPage, page * rowsPerPage))
  }


  // select
  async select (filter: string): Promise<HttpResponse> {
    let filteredStatusPagamento = this.statusPagamento

    filteredStatusPagamento = filteredStatusPagamento.filter((statusPagamento) => {
      if (statusPagamento.nome.includes(filter)) return true
      if (statusPagamento.descricao.includes(filter)) return true

      return false
    })

    return ok(filteredStatusPagamento)
  }


  //
  // id select
  idSelect(id: string): Promise<HttpResponse<any>> {
    throw new Error('Method not implemented.')
  }


  // count
  async count (search: string,): Promise<HttpResponse> {
    let filteredStatusPagamento = this.statusPagamento

    filteredStatusPagamento = filteredStatusPagamento.filter((statusPagamento) => {
      if (statusPagamento.nome.includes(search)) return true
      if (statusPagamento.descricao.includes(search)) return true

      return false
    })

    return ok(filteredStatusPagamento.length)
  }


  // get
  async get (id: string): Promise<HttpResponse> {
    const statusPagamento = this.statusPagamento.find((statusPagamento) => statusPagamento.id === id)

    if (typeof statusPagamento === 'undefined') {
      return notFound()
    } else {
      return ok(statusPagamento)
    }
  }


  // update
  async update ({
    id,
    nome,
    descricao,
    desabilitado
  }: IStatusPagamentoDTO): Promise<HttpResponse> {
    const index = this.statusPagamento.findIndex((statusPagamento) => statusPagamento.id === id)

    this.statusPagamento[index].nome = nome
    this.statusPagamento[index].descricao = descricao
    this.statusPagamento[index].desabilitado = desabilitado

    return ok(this.statusPagamento[index])
  }


  // delete
  async delete (id: string): Promise<HttpResponse> {
    const index = this.statusPagamento.findIndex((statusPagamento) => statusPagamento.id === id)

    this.statusPagamento.splice(index, 1)

    return ok(this.statusPagamento)
  }


  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse<any>> {
    throw new Error('Method not implemented.')
  }
}

export { StatusPagamentoRepositoryInMemory }
