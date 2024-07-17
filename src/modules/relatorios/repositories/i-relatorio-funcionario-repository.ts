import { IRelatorioFuncionarioDTO } from "@modules/relatorios/dtos/i-relatorio-funcionario-dto"
import { HttpResponse } from "@shared/helpers"

interface IRelatorioFuncionarioRepository {
  // create
  create(data: IRelatorioFuncionarioDTO): Promise<HttpResponse>

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
  update(data: IRelatorioFuncionarioDTO): Promise<HttpResponse>

  // delete
  delete(id: string): Promise<HttpResponse>

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse>

  getPedidosByData(dataInicio: Date, dataFim: Date): Promise<HttpResponse>

  getPedidosByDataAndFuncionario(dataInicio: Date, dataFim: Date, funcionarioId: string): Promise<HttpResponse>
}

export { IRelatorioFuncionarioRepository }
