import { IPedidoDTO } from "@modules/pedido/dtos/i-pedido-dto"
import { HttpResponse } from "@shared/helpers"
import { EntityManager } from "typeorm"

interface IPedidoRepository {
  // create
  create(data: IPedidoDTO): Promise<HttpResponse>

  createWithQueryRunner(
    {
      sequencial,
      clienteId,
      data,
      hora,
      valorTotal,
      desconto,
      funcionarioId,
      meioPagamentoId,
      statusPagamentoId,
      isPagamentoPosterior,
      desabilitado,
    }: IPedidoDTO,
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

  countWithQueryRunner(search: string, filter: string, transactionManager: EntityManager): Promise<HttpResponse>

  // get
  get(id: string): Promise<HttpResponse>

  // update
  update(
    {
      id,
      sequencial,
      clienteId,
      data,
      hora,
      valorTotal,
      desconto,
      funcionarioId,
      meioPagamentoId,
      statusPagamentoId,
      isPagamentoPosterior,
      desabilitado,
    }: IPedidoDTO,
    transactionManager: EntityManager
  ): Promise<HttpResponse>

  // delete
  delete(id: string): Promise<HttpResponse>

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse>
}

export { IPedidoRepository }
