import { IMeioPagamentoDTO } from '@modules/cadastros/dtos/i-meio-pagamento-dto'
import { IMeioPagamentoRepository } from '@modules/cadastros/repositories/i-meio-pagamento-repository'
import { MeioPagamento } from '@modules/cadastros/infra/typeorm/entities/meio-pagamento'
import { ok, notFound, HttpResponse } from '@shared/helpers'

class MeioPagamentoRepositoryInMemory implements IMeioPagamentoRepository {
  meiosPagamento: MeioPagamento[] = []

  // create
  async create ({
    nome,
    descricao,
    desabilitado
  }: IMeioPagamentoDTO): Promise<HttpResponse> {
    const meioPagamento = new MeioPagamento()

    Object.assign(meioPagamento, {
      nome,
      descricao,
      desabilitado
    })

    this.meiosPagamento.push(meioPagamento)

    return ok(meioPagamento)
  }


  // list
  async list (
    search: string,
    page: number,
    rowsPerPage: number,
    order: string
  ): Promise<HttpResponse> {
    let filteredMeiosPagamento = this.meiosPagamento

    filteredMeiosPagamento = filteredMeiosPagamento.filter((meioPagamento) => {
      if (meioPagamento.nome.includes(search)) return true
      if (meioPagamento.descricao.includes(search)) return true

      return false
    })

    return ok(filteredMeiosPagamento.slice((page - 1) * rowsPerPage, page * rowsPerPage))
  }


  // select
  async select (filter: string): Promise<HttpResponse> {
    let filteredMeiosPagamento = this.meiosPagamento

    filteredMeiosPagamento = filteredMeiosPagamento.filter((meioPagamento) => {
      if (meioPagamento.nome.includes(filter)) return true
      if (meioPagamento.descricao.includes(filter)) return true

      return false
    })

    return ok(filteredMeiosPagamento)
  }


  //
  // id select
  idSelect(id: string): Promise<HttpResponse<any>> {
    throw new Error('Method not implemented.')
  }


  // count
  async count (search: string,): Promise<HttpResponse> {
    let filteredMeiosPagamento = this.meiosPagamento

    filteredMeiosPagamento = filteredMeiosPagamento.filter((meioPagamento) => {
      if (meioPagamento.nome.includes(search)) return true
      if (meioPagamento.descricao.includes(search)) return true

      return false
    })

    return ok(filteredMeiosPagamento.length)
  }


  // get
  async get (id: string): Promise<HttpResponse> {
    const meioPagamento = this.meiosPagamento.find((meioPagamento) => meioPagamento.id === id)

    if (typeof meioPagamento === 'undefined') {
      return notFound()
    } else {
      return ok(meioPagamento)
    }
  }


  // update
  async update ({
    id,
    nome,
    descricao,
    desabilitado
  }: IMeioPagamentoDTO): Promise<HttpResponse> {
    const index = this.meiosPagamento.findIndex((meioPagamento) => meioPagamento.id === id)

    this.meiosPagamento[index].nome = nome
    this.meiosPagamento[index].descricao = descricao
    this.meiosPagamento[index].desabilitado = desabilitado

    return ok(this.meiosPagamento[index])
  }


  // delete
  async delete (id: string): Promise<HttpResponse> {
    const index = this.meiosPagamento.findIndex((meioPagamento) => meioPagamento.id === id)

    this.meiosPagamento.splice(index, 1)

    return ok(this.meiosPagamento)
  }


  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse<any>> {
    throw new Error('Method not implemented.')
  }
}

export { MeioPagamentoRepositoryInMemory }
