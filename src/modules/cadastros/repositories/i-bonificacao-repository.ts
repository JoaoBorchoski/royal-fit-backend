import { IBonificacaoDTO } from "@modules/cadastros/dtos/i-bonificacao-dto"
import { HttpResponse } from "@shared/helpers"
import { EntityManager } from "typeorm"

interface IBonificacaoRepository {
  // create
  create(data: IBonificacaoDTO): Promise<HttpResponse>

  createWithQueryRunner(
    { clienteId, totalVendido, bonificacaoDisponivel, desabilitado }: IBonificacaoDTO,
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

  // update
  update(data: IBonificacaoDTO): Promise<HttpResponse>

  // delete
  delete(id: string): Promise<HttpResponse>

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse>
}

export { IBonificacaoRepository }
