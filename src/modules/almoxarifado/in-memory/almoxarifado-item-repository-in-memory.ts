import { IAlmoxarifadoItemDTO } from '@modules/almoxarifado/dtos/i-almoxarifado-item-dto'
import { IAlmoxarifadoItemRepository } from '@modules/almoxarifado/repositories/i-almoxarifado-item-repository'
import { AlmoxarifadoItem } from '@modules/almoxarifado/infra/typeorm/entities/almoxarifado-item'
import { ok, notFound, HttpResponse } from '@shared/helpers'

class AlmoxarifadoItemRepositoryInMemory implements IAlmoxarifadoItemRepository {
  almoxarifadoItens: AlmoxarifadoItem[] = []

  // create
  async create ({
    item,
    quantidade,
    quantidadeMin,
    desabilitado
  }: IAlmoxarifadoItemDTO): Promise<HttpResponse> {
    const almoxarifadoItem = new AlmoxarifadoItem()

    Object.assign(almoxarifadoItem, {
      item,
      quantidade,
      quantidadeMin,
      desabilitado
    })

    this.almoxarifadoItens.push(almoxarifadoItem)

    return ok(almoxarifadoItem)
  }


  // list
  async list (
    search: string,
    page: number,
    rowsPerPage: number,
    order: string
  ): Promise<HttpResponse> {
    let filteredAlmoxarifadoItens = this.almoxarifadoItens

    filteredAlmoxarifadoItens = filteredAlmoxarifadoItens.filter((almoxarifadoItem) => {
      if (almoxarifadoItem.item.includes(search)) return true

      return false
    })

    return ok(filteredAlmoxarifadoItens.slice((page - 1) * rowsPerPage, page * rowsPerPage))
  }


  // select
  async select (filter: string): Promise<HttpResponse> {
    let filteredAlmoxarifadoItens = this.almoxarifadoItens

    filteredAlmoxarifadoItens = filteredAlmoxarifadoItens.filter((almoxarifadoItem) => {
      if (almoxarifadoItem.item.includes(filter)) return true

      return false
    })

    return ok(filteredAlmoxarifadoItens)
  }


  //
  // id select
  idSelect(id: string): Promise<HttpResponse<any>> {
    throw new Error('Method not implemented.')
  }


  // count
  async count (search: string,): Promise<HttpResponse> {
    let filteredAlmoxarifadoItens = this.almoxarifadoItens

    filteredAlmoxarifadoItens = filteredAlmoxarifadoItens.filter((almoxarifadoItem) => {
      if (almoxarifadoItem.item.includes(search)) return true

      return false
    })

    return ok(filteredAlmoxarifadoItens.length)
  }


  // get
  async get (id: string): Promise<HttpResponse> {
    const almoxarifadoItem = this.almoxarifadoItens.find((almoxarifadoItem) => almoxarifadoItem.id === id)

    if (typeof almoxarifadoItem === 'undefined') {
      return notFound()
    } else {
      return ok(almoxarifadoItem)
    }
  }


  // update
  async update ({
    id,
    item,
    quantidade,
    quantidadeMin,
    desabilitado
  }: IAlmoxarifadoItemDTO): Promise<HttpResponse> {
    const index = this.almoxarifadoItens.findIndex((almoxarifadoItem) => almoxarifadoItem.id === id)

    this.almoxarifadoItens[index].item = item
    this.almoxarifadoItens[index].quantidade = quantidade
    this.almoxarifadoItens[index].quantidadeMin = quantidadeMin
    this.almoxarifadoItens[index].desabilitado = desabilitado

    return ok(this.almoxarifadoItens[index])
  }


  // delete
  async delete (id: string): Promise<HttpResponse> {
    const index = this.almoxarifadoItens.findIndex((almoxarifadoItem) => almoxarifadoItem.id === id)

    this.almoxarifadoItens.splice(index, 1)

    return ok(this.almoxarifadoItens)
  }


  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse<any>> {
    throw new Error('Method not implemented.')
  }
}

export { AlmoxarifadoItemRepositoryInMemory }
