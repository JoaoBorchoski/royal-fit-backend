import { IFuncionarioDTO } from "@modules/cadastros/dtos/i-funcionario-dto"
import { HttpResponse } from "@shared/helpers"

interface IFuncionarioRepository {
  // create
  create(data: IFuncionarioDTO): Promise<HttpResponse>

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
  update(data: IFuncionarioDTO): Promise<HttpResponse>

  // delete
  delete(id: string): Promise<HttpResponse>

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse>

  getFuncionarioByEmail(email: string): Promise<HttpResponse>
}

export { IFuncionarioRepository }
