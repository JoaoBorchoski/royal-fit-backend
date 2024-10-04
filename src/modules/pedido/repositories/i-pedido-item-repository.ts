import { IPedidoItemDTO } from "@modules/pedido/dtos/i-pedido-item-dto"
import { HttpResponse } from "@shared/helpers"
import { EntityManager } from "typeorm"

interface IPedidoItemRepository {
  // create
  create(data: IPedidoItemDTO): Promise<HttpResponse>

  createWithQueryRunner(
    { produtoId, pedidoId, quantidade, desabilitado }: IPedidoItemDTO,
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

  getByPedidoIdAndProdutoId(pedidoId: string, produtoId: string): Promise<HttpResponse>

  // update
  update({ id, produtoId, pedidoId, quantidade, desabilitado }: IPedidoItemDTO, transactionManager: EntityManager): Promise<HttpResponse>

  // delete
  delete(id: string): Promise<HttpResponse>

  deleteByPedidoId(pedidoId: string): Promise<HttpResponse>

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse>

  getByPedidoAndPedidoItemId(pedidoId: string, pedidoItemId: string): Promise<HttpResponse>

  deleteByPedidoIdWithQueryRunner(pedidoId: string, transactionManager: EntityManager): Promise<HttpResponse>
}

export { IPedidoItemRepository }
