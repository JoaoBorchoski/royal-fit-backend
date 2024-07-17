import { IEstoqueDTO } from "@modules/cadastros/dtos/i-estoque-dto"
import { HttpResponse } from "@shared/helpers"
import { EntityManager } from "typeorm"

interface IEstoqueRepository {
  // create
  create(data: IEstoqueDTO): Promise<HttpResponse>

  createWithQueryRunner(
    { produtoId, quantidade, desabilitado }: IEstoqueDTO,
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

  getByProdutoId(produtoId: string): Promise<HttpResponse>

  // update
  update(data: IEstoqueDTO): Promise<HttpResponse>

  updateEstoqueQuantidade(id: string, quantidade: number, transactionManager: EntityManager): Promise<HttpResponse>

  // delete
  delete(id: string): Promise<HttpResponse>

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse>
}

export { IEstoqueRepository }
