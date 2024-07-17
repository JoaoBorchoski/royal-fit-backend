import { IProdutoDTO } from "@modules/cadastros/dtos/i-produto-dto"
import { HttpResponse } from "@shared/helpers"
import { EntityManager } from "typeorm"

interface IProdutoRepository {
  // create
  create(data: IProdutoDTO): Promise<HttpResponse>

  createWithQueryRunner(
    { nome, preco, descricao, desabilitado }: IProdutoDTO,
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

  getByname(nome: string): Promise<HttpResponse>

  // update
  update(data: IProdutoDTO): Promise<HttpResponse>

  // delete
  delete(id: string): Promise<HttpResponse>

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse>
}

export { IProdutoRepository }
