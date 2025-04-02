import { IFechamentoDTO } from "@modules/financeiro/dtos/i-fechamento-dto"
import { HttpResponse } from "@shared/helpers"

interface IFechamentoRepository {
  // create
  create(data: IFechamentoDTO): Promise<HttpResponse>

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
  update(data: IFechamentoDTO): Promise<HttpResponse>

  // delete
  delete(id: string): Promise<HttpResponse>

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse>

  getData(): Promise<HttpResponse>

  getFechamentoRelatorio(type: string)

  getFechamentoRelatorioDetalhado(type: string, payload: any)
}

export { IFechamentoRepository }
