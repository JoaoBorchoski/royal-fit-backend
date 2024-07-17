import { Brackets, EntityManager, getRepository, Repository, TransactionManager } from "typeorm"
import { IPedidoDTO } from "@modules/pedido/dtos/i-pedido-dto"
import { IPedidoRepository } from "@modules/pedido/repositories/i-pedido-repository"
import { Pedido } from "@modules/pedido/infra/typeorm/entities/pedido"
import { noContent, serverError, ok, notFound, HttpResponse } from "@shared/helpers"
import { AppError } from "@shared/errors/app-error"
import { PedidoItem } from "../entities/pedido-item"

class PedidoRepository implements IPedidoRepository {
  private repository: Repository<Pedido>

  constructor() {
    this.repository = getRepository(Pedido)
  }

  // create
  async create({
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
  }: IPedidoDTO): Promise<HttpResponse> {
    const pedido = this.repository.create({
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
    })

    const result = await this.repository
      .save(pedido)
      .then((pedidoResult) => {
        return ok(pedidoResult)
      })
      .catch((error) => {
        return serverError(error)
      })

    return result
  }

  async createWithQueryRunner(
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
    @TransactionManager() transactionManager: EntityManager
  ): Promise<HttpResponse> {
    const pedido = transactionManager.create(Pedido, {
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
    })

    const result = await transactionManager
      .save(pedido)
      .then((pedidoResult) => {
        return ok(pedidoResult)
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

    const referenceArray = ["data", "sequencial", "clienteNome", "valorTotal"]
    const columnOrder = new Array<"ASC" | "DESC">(2).fill("ASC")

    const index = referenceArray.indexOf(columnName)

    columnOrder[index] = columnDirection

    const offset = rowsPerPage * page

    try {
      let query = this.repository
        .createQueryBuilder("ped")
        .select([
          'ped.id as "id"',
          'ped.sequencial as "sequencial"',
          'a.id as "clienteId"',
          'a.nome as "clienteNome"',
          'ped.data as "data"',
          'ped.valorTotal :: float as "valorTotal"',
        ])
        .leftJoin("ped.clienteId", "a")

      if (filter) {
        query = query.where(filter)
      }

      const pedidos = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(ped.sequencial AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .addOrderBy("ped.data", "DESC")
        .addOrderBy("ped.sequencial", columnOrder[1])
        .addOrderBy("a.nome", columnOrder[2])
        .addOrderBy("ped.valorTotal", columnOrder[3])
        .offset(offset)
        .limit(rowsPerPage)
        .take(rowsPerPage)
        .getRawMany()

      return ok(pedidos)
    } catch (err) {
      return serverError(err)
    }
  }

  // select
  async select(filter: string): Promise<HttpResponse> {
    try {
      const pedidos = await this.repository
        .createQueryBuilder("ped")
        .select(['ped.id as "value"', 'ped.nome as "label"'])
        .where("ped.nome ilike :filter", { filter: `${filter}%` })
        .addOrderBy("ped.nome")
        .getRawMany()

      return ok(pedidos)
    } catch (err) {
      return serverError(err)
    }
  }

  // id select
  async idSelect(id: string): Promise<HttpResponse> {
    try {
      const pedido = await this.repository
        .createQueryBuilder("ped")
        .select(['ped.id as "value"', 'ped.nome as "label"'])
        .where("ped.id = :id", { id: `${id}` })
        .getRawOne()

      return ok(pedido)
    } catch (err) {
      return serverError(err)
    }
  }

  // count
  async count(search: string, filter: string): Promise<HttpResponse> {
    try {
      let query = this.repository.createQueryBuilder("ped").select(['ped.id as "id"']).leftJoin("ped.clienteId", "a")

      if (filter) {
        query = query.where(filter)
      }

      const pedidos = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(ped.sequencial AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .getRawMany()

      return ok({ count: pedidos.length })
    } catch (err) {
      return serverError(err)
    }
  }

  async countWithQueryRunner(
    search: string,
    filter: string,
    @TransactionManager() transactionManager: EntityManager
  ): Promise<HttpResponse> {
    try {
      let query = transactionManager.createQueryBuilder(Pedido, "ped").select(['ped.id as "id"']).leftJoin("ped.clienteId", "a")

      if (filter) {
        query = query.where(filter)
      }

      const pedidos = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(ped.sequencial AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .getRawMany()

      return ok({ count: pedidos.length })
    } catch (err) {
      return serverError(err)
    }
  }

  // get
  async get(id: string): Promise<HttpResponse> {
    try {
      const pedido = await this.repository
        .createQueryBuilder("ped")
        .select([
          'ped.id as "id"',
          'ped.sequencial as "sequencial"',
          'ped.clienteId as "clienteId"',
          'ped.data as "data"',
          'ped.hora as "hora"',
          'ped.valorTotal :: float as "valorTotal"',
          'ped.desconto as "desconto"',
          'ped.funcionarioId as "funcionarioId"',
          'ped.meioPagamentoId as "meioPagamentoId"',
          'ped.statusPagamentoId as "statusPagamentoId"',
          'ped.isPagamentoPosterior as "isPagamentoPosterior"',
          'ped.desabilitado as "desabilitado"',
        ])
        .leftJoin("ped.clienteId", "a")
        .leftJoin("ped.funcionarioId", "b")
        .leftJoin("ped.meioPagamentoId", "c")
        .leftJoin("ped.statusPagamentoId", "d")
        .where("ped.id = :id", { id })
        .getRawOne()

      if (typeof pedido === "undefined") {
        return noContent()
      }

      const pedidoItens = await getRepository(PedidoItem)
        .createQueryBuilder("pedItem")
        .select([
          'pedItem.id as "id"',
          'pedItem.produtoId as "produtoId"',
          'prod.nome as "produtoNome"',
          'prod.preco as "preco"',
          'pedItem.quantidade as "quantidade"',
          // 'pedItem.valorTotal as "valor"',
          'CAST(pedItem.quantidade * prod.preco AS float) as "valor"',
        ])
        .leftJoin("pedItem.pedidoId", "ped")
        .leftJoin("pedItem.produtoId", "prod")
        .where("pedItem.pedidoId = :id", { id })
        .getRawMany()

      if (pedidoItens.length > 0) {
        pedido["pedidoItemForm"] = [...pedidoItens]
      }

      return ok(pedido)
    } catch (err) {
      return serverError(err)
    }
  }

  // update
  async update(
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
    @TransactionManager() transactionManager: EntityManager
  ): Promise<HttpResponse> {
    const pedido = await transactionManager.findOne(Pedido, id)

    if (!pedido) {
      return notFound()
    }

    const newpedido = transactionManager.create(Pedido, {
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
    })

    try {
      await transactionManager.save(newpedido)

      return ok(newpedido)
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

export { PedidoRepository }
