import { Brackets, EntityManager, getRepository, Repository, TransactionManager } from "typeorm"
import { IPedidoItemDTO } from "@modules/pedido/dtos/i-pedido-item-dto"
import { IPedidoItemRepository } from "@modules/pedido/repositories/i-pedido-item-repository"
import { PedidoItem } from "@modules/pedido/infra/typeorm/entities/pedido-item"
import { noContent, serverError, ok, notFound, HttpResponse } from "@shared/helpers"
import { AppError } from "@shared/errors/app-error"
import { PedidoBonificado } from "../entities/pedido-bonificado"

class PedidoItemRepository implements IPedidoItemRepository {
  private repository: Repository<PedidoItem>

  constructor() {
    this.repository = getRepository(PedidoItem)
  }

  // create
  async create({ produtoId, pedidoId, quantidade, desabilitado }: IPedidoItemDTO): Promise<HttpResponse> {
    const pedidoItem = this.repository.create({
      produtoId,
      pedidoId,
      quantidade,
      desabilitado,
    })

    const result = await this.repository
      .save(pedidoItem)
      .then((pedidoItemResult) => {
        return ok(pedidoItemResult)
      })
      .catch((error) => {
        return serverError(error)
      })

    return result
  }

  async createWithQueryRunner(
    { produtoId, pedidoId, quantidade, desabilitado }: IPedidoItemDTO,
    @TransactionManager() transactionManager: EntityManager
  ): Promise<HttpResponse> {
    const pedidoItem = transactionManager.create(PedidoItem, {
      produtoId,
      pedidoId,
      quantidade,
      desabilitado,
    })

    const result = await transactionManager
      .save(pedidoItem)
      .then((pedidoItemResult) => {
        return ok(pedidoItemResult)
      })
      .catch((error) => {
        return serverError(error)
      })

    return result
  }

  // list
  async list(search: string, page: number, rowsPerPage: number, order: string, filter: string): Promise<HttpResponse> {
    let columnName: string
    let columnDirection: "ASC" | "DESC"

    if (typeof order === "undefined" || order === "") {
      columnName = "nome"
      columnDirection = "ASC"
    } else {
      columnName = order.substring(0, 1) === "-" ? order.substring(1) : order
      columnDirection = order.substring(0, 1) === "-" ? "DESC" : "ASC"
    }

    const referenceArray = []
    const columnOrder = new Array<"ASC" | "DESC">(2).fill("ASC")

    const index = referenceArray.indexOf(columnName)

    columnOrder[index] = columnDirection

    const offset = rowsPerPage * page

    try {
      let query = this.repository.createQueryBuilder("ped").select(['ped.id as "id"'])

      if (filter) {
        query = query.where(filter)
      }

      const pedidoItens = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(ped. AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .offset(offset)
        .limit(rowsPerPage)
        .take(rowsPerPage)
        .getRawMany()

      return ok(pedidoItens)
    } catch (err) {
      return serverError(err)
    }
  }

  // select
  async select(filter: string): Promise<HttpResponse> {
    try {
      const pedidoItens = await this.repository
        .createQueryBuilder("ped")
        .select(['ped. as "value"', 'ped. as "label"'])
        .where("ped. ilike :filter", { filter: `${filter}%` })
        .addOrderBy("ped.")
        .getRawMany()

      return ok(pedidoItens)
    } catch (err) {
      return serverError(err)
    }
  }

  // id select
  async idSelect(id: string): Promise<HttpResponse> {
    try {
      const pedidoItem = await this.repository
        .createQueryBuilder("ped")
        .select(['ped. as "value"', 'ped. as "label"'])
        .where("ped. = :id", { id: `${id}` })
        .getRawOne()

      return ok(pedidoItem)
    } catch (err) {
      return serverError(err)
    }
  }

  // count
  async count(search: string, filter: string): Promise<HttpResponse> {
    try {
      let query = this.repository.createQueryBuilder("ped").select(['ped.id as "id"'])

      if (filter) {
        query = query.where(filter)
      }

      const pedidoItens = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(ped. AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .getRawMany()

      return ok({ count: pedidoItens.length })
    } catch (err) {
      return serverError(err)
    }
  }

  // get
  async get(id: string): Promise<HttpResponse> {
    try {
      const pedidoItem = await this.repository
        .createQueryBuilder("ped")
        .select([
          'ped.id as "id"',
          'ped.produtoId as "produtoId"',
          'a.nome as "produtoNome"',
          'ped.pedidoId as "pedidoId"',
          'b.nome as "pedidoNome"',
          'ped.quantidade as "quantidade"',
          'ped.desabilitado as "desabilitado"',
        ])
        .leftJoin("ped.produtoId", "a")
        .leftJoin("ped.pedidoId", "b")
        .where("ped.id = :id", { id })
        .getRawOne()

      if (typeof pedidoItem === "undefined") {
        return noContent()
      }

      return ok(pedidoItem)
    } catch (err) {
      return serverError(err)
    }
  }

  async getByPedidoIdAndProdutoId(pedidoId: string, produtoId: string): Promise<HttpResponse> {
    try {
      const pedidoItem = await this.repository
        .createQueryBuilder("ped")
        .select([
          'ped.id as "id"',
          'ped.produtoId as "produtoId"',
          'ped.pedidoId as "pedidoId"',
          'ped.quantidade as "quantidade"',
          'ped.desabilitado as "desabilitado"',
        ])
        .where("ped.pedidoId = :pedidoId", { pedidoId })
        .andWhere("ped.produtoId = :produtoId", { produtoId })
        .getRawOne()

      if (typeof pedidoItem === "undefined") {
        return noContent()
      }

      return ok(pedidoItem)
    } catch (err) {
      return serverError(err)
    }
  }

  async getBonificacaoByClienteId(clienteId: string): Promise<HttpResponse> {
    try {
      const result = await getRepository(PedidoBonificado)
        .createQueryBuilder("pedBon")
        .select("COALESCE(CAST(SUM(pedBon.quantidade) AS int), 0)", "total")
        .where("pedBon.clienteId = :clienteId", { clienteId })
        .getRawOne()

      return ok(result)
    } catch (err) {
      return serverError(err)
    }
  }

  // update
  async update(
    { id, produtoId, pedidoId, quantidade, desabilitado }: IPedidoItemDTO,
    @TransactionManager() transactionManager: EntityManager
  ): Promise<HttpResponse> {
    const pedidoItem = await transactionManager.findOne(PedidoItem, id)

    if (!pedidoItem) {
      return notFound()
    }

    const newpedidoItem = transactionManager.create(PedidoItem, {
      id,
      produtoId,
      pedidoId,
      quantidade,
      desabilitado,
    })

    try {
      await transactionManager.save(newpedidoItem)

      return ok(newpedidoItem)
    } catch (err) {
      return serverError(err)
    }
  }

  // delete
  async delete(id: string): Promise<HttpResponse> {
    try {
      await this.repository.delete(id)

      return noContent()
    } catch (err) {
      if (err.message.slice(0, 10) === "null value") {
        throw new AppError("not null constraint", 404)
      }

      return serverError(err)
    }
  }

  async deleteByPedidoId(pedidoId: string): Promise<HttpResponse> {
    try {
      await this.repository.delete({ pedidoId })

      return noContent()
    } catch (err) {
      if (err.message.slice(0, 10) === "null value") {
        throw new AppError("not null constraint", 404)
      }

      return serverError(err)
    }
  }

  // multi delete
  async multiDelete(ids: string[]): Promise<HttpResponse> {
    try {
      await this.repository.delete(ids)

      return noContent()
    } catch (err) {
      if (err.message.slice(0, 10) === "null value") {
        throw new AppError("not null constraint", 404)
      }

      return serverError(err)
    }
  }
}

export { PedidoItemRepository }
