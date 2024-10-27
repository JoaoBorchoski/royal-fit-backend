import { HttpResponse } from "@shared/helpers"
import { IEntradaGarrafaoDTO } from "../dtos/i-entrada-garrafao-dto"
import { EntityManager } from "typeorm"

interface IEntradaGarrafaoRepository {
  // create
  create(data: IEntradaGarrafaoDTO): Promise<HttpResponse>

  createWithQueryRunner(
    { clienteId, quantidade, isRoyalfit, desabilitado }: IEntradaGarrafaoDTO,
    transactionManager: EntityManager
  ): Promise<HttpResponse>

  // list
  list(search: string, page: number, rowsPerPage: number, order: string, filter: string): Promise<HttpResponse>

  // select
  select(filter: string, clienteId: string): Promise<HttpResponse>

  // id select
  idSelect(id: string): Promise<HttpResponse>

  // count
  count(search: string, filter: string): Promise<HttpResponse>

  // get
  get(id: string): Promise<HttpResponse>

  // update
  update(data: IEntradaGarrafaoDTO): Promise<HttpResponse>

  // delete
  delete(id: string): Promise<HttpResponse>

  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse>
  getEntradasByDataAndCliente(dataInicio: Date, dataFim: Date, clienteId: string): Promise<HttpResponse>
}

export { IEntradaGarrafaoRepository }
