import { IPagamentoDTO } from "@modules/clientes/dtos/i-pagamento-dto"
import { HttpResponse } from "@shared/helpers"

interface IPagamentoRepository {
  // create
  create(data: IPagamentoDTO): Promise<HttpResponse>

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

  getByClienteId(clienteId: string): Promise<HttpResponse>

  // update
  update(data: IPagamentoDTO): Promise<HttpResponse>

  // delete
  delete(id: string): Promise<HttpResponse>

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse>

  getPagamentosByDataAndCliente(dataInicio: Date, dataFim: Date, clienteId: string): Promise<HttpResponse>
}

export { IPagamentoRepository }
