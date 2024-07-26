import { IPedidoBonificadoDTO } from "@modules/pedido/dtos/i-pedido-bonificado-dto"
import { HttpResponse } from "@shared/helpers"

interface IPedidoBonificadoRepository {
  // create
  create(data: IPedidoBonificadoDTO): Promise<HttpResponse>

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
  update(data: IPedidoBonificadoDTO): Promise<HttpResponse>

  // delete
  delete(id: string): Promise<HttpResponse>

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse>

  getAllByClienteIdAndData(clienteId: string, dataInicio: Date, dataFim: Date): Promise<HttpResponse>
}

export { IPedidoBonificadoRepository }
