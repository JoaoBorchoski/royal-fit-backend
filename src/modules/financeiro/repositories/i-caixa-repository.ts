import { ICaixaDTO } from "@modules/financeiro/dtos/i-caixa-dto"
import { HttpResponse } from "@shared/helpers"
import { EntityManager } from "typeorm"

interface ICaixaRepository {
  // create
  create(data: ICaixaDTO): Promise<HttpResponse>

  createWithQueryRunner({ descricao, valor, data, pedidoId, clienteId, formaPagamentoId }: ICaixaDTO, transactionManager: EntityManager): Promise<HttpResponse>

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

  getByPedidoId(pedidoId: string): Promise<HttpResponse>

  // update
  update(data: ICaixaDTO): Promise<HttpResponse>

  updateWithQueryRunner(
    { id, descricao, valor, data, pedidoId, clienteId, formaPagamentoId }: ICaixaDTO,
    transactionManager: EntityManager
  ): Promise<HttpResponse>

  // delete
  delete(id: string): Promise<HttpResponse>

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse>
}

export { ICaixaRepository }
