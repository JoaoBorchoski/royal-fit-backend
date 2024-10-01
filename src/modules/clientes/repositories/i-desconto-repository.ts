import { IDescontoDTO } from "@modules/clientes/dtos/i-desconto-dto"
import { HttpResponse } from "@shared/helpers"

interface IDescontoRepository {
  // create
  create(data: IDescontoDTO): Promise<HttpResponse>

  // list
  list(search: string, page: number, rowsPerPage: number, order: string, filter: string): Promise<HttpResponse>

  // select
  select(filter: string): Promise<HttpResponse>

  // id select
  idSelect(id: string): Promise<HttpResponse>

  // count
  count(search: string, filter: string): Promise<HttpResponse>

  // get
  get(id: string): Promise<HttpResponse>

  // update
  update(data: IDescontoDTO): Promise<HttpResponse>

  // delete
  delete(id: string): Promise<HttpResponse>

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse>

  deleteByClienteId(clienteId: string): Promise<HttpResponse>
}

export { IDescontoRepository }
