import { IBalancoDTO } from "@modules/clientes/dtos/i-balanco-dto"
import { HttpResponse } from "@shared/helpers"
import { EntityManager } from "typeorm"

interface IBalancoRepository {
  // create
  create(data: IBalancoDTO): Promise<HttpResponse>

  createWithQueryRunner(
    { clienteId, saldoDevedor, desabilitado }: IBalancoDTO,
    transactionManager: EntityManager
  ): Promise<HttpResponse>

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

  getByClienteIdWithQueryRunner(clienteId: string, transactionManager: EntityManager): Promise<HttpResponse>

  // update
  update(data: IBalancoDTO): Promise<HttpResponse>

  // delete
  delete(id: string): Promise<HttpResponse>

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse>
}

export { IBalancoRepository }
