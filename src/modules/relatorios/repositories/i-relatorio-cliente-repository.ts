import { IRelatorioClienteDTO } from '@modules/relatorios/dtos/i-relatorio-cliente-dto'
import { HttpResponse } from '@shared/helpers'

interface IRelatorioClienteRepository {
  // create
  create (data: IRelatorioClienteDTO): Promise<HttpResponse> 


  // list
  list (
    search: string,
    page: number,
    rowsPerPage: number,
    order: string,
    filter: string
  ): Promise<HttpResponse>


  // select
  select (filter: string): Promise<HttpResponse>
  
  
  // id select
  idSelect (id: string): Promise<HttpResponse>


  // count
  count (search: string, filter: string): Promise<HttpResponse>


  // get
  get (id: string): Promise<HttpResponse>


  // update
  update (data: IRelatorioClienteDTO): Promise<HttpResponse>


  // delete
  delete (id: string): Promise<HttpResponse>

  
  // multi delete
  multiDelete (ids: string[]): Promise<HttpResponse>
}

export { IRelatorioClienteRepository }
