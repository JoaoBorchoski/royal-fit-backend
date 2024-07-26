import { Brackets, getRepository, Repository } from "typeorm"
import { IPedidoBonificadoDTO } from "@modules/pedido/dtos/i-pedido-bonificado-dto"
import { IPedidoBonificadoRepository } from "@modules/pedido/repositories/i-pedido-bonificado-repository"
import { PedidoBonificado } from "@modules/pedido/infra/typeorm/entities/pedido-bonificado"
import { noContent, serverError, ok, notFound, HttpResponse } from "@shared/helpers"
import { AppError } from "@shared/errors/app-error"

class PedidoBonificadoRepository implements IPedidoBonificadoRepository {
  private repository: Repository<PedidoBonificado>

  constructor() {
    this.repository = getRepository(PedidoBonificado)
  }

  // create
  async create({ clienteId, quantidade, data, isLiberado, desabilitado }: IPedidoBonificadoDTO): Promise<HttpResponse> {
    const pedidoBonificado = this.repository.create({
      clienteId,
      quantidade,
      data,
      isLiberado,
      desabilitado,
    })

    const result = await this.repository
      .save(pedidoBonificado)
      .then((pedidoBonificadoResult) => {
        return ok(pedidoBonificadoResult)
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

    const referenceArray = ["clienteNome", "data"]
    const columnOrder = new Array<"ASC" | "DESC">(2).fill("ASC")

    const index = referenceArray.indexOf(columnName)

    columnOrder[index] = columnDirection

    const offset = rowsPerPage * page

    try {
      let query = this.repository
        .createQueryBuilder("ped")
        .select([
          'ped.id as "id"',
          'a.id as "clienteId"',
          'a.nome as "clienteNome"',
          'ped.data as "data"',
          'ped.isLiberado as "isLiberado"',
          'ped.quantidade as "quantidade"',
        ])
        .leftJoin("ped.clienteId", "a")

      if (filter) {
        query = query.where(filter)
      }

      const pedidoBonificados = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(a.nome AS VARCHAR) ilike :search", { search: `%${search}%` })
            query.orWhere("TO_CHAR(ped.data, 'YYYY-MM-DD HH24:MI:SS') ILIKE :search", { search: `%${search}%` })
          })
        )
        .addOrderBy("a.nome", columnOrder[0])
        .addOrderBy("ped.data", columnOrder[1])
        .offset(offset)
        .limit(rowsPerPage)
        .take(rowsPerPage)
        .getRawMany()

      return ok(pedidoBonificados)
    } catch (err) {
      return serverError(err)
    }
  }

  // select
  async select(filter: string): Promise<HttpResponse> {
    try {
      const pedidoBonificados = await this.repository
        .createQueryBuilder("ped")
        .select(['ped. as "value"', 'ped. as "label"'])
        .where("ped. ilike :filter", { filter: `${filter}%` })
        .addOrderBy("ped.")
        .getRawMany()

      return ok(pedidoBonificados)
    } catch (err) {
      return serverError(err)
    }
  }

  // id select
  async idSelect(id: string): Promise<HttpResponse> {
    try {
      const pedidoBonificado = await this.repository
        .createQueryBuilder("ped")
        .select(['ped. as "value"', 'ped. as "label"'])
        .where("ped. = :id", { id: `${id}` })
        .getRawOne()

      return ok(pedidoBonificado)
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

      const pedidoBonificados = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(a.nome AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .getRawMany()

      return ok({ count: pedidoBonificados.length })
    } catch (err) {
      return serverError(err)
    }
  }

  // get
  async get(id: string): Promise<HttpResponse> {
    try {
      const pedidoBonificado = await this.repository
        .createQueryBuilder("ped")
        .select([
          'ped.id as "id"',
          'ped.clienteId as "clienteId"',
          'a.nome as "clienteNome"',
          'ped.quantidade as "quantidade"',
          'ped.data as "data"',
          'ped.isLiberado as "isLiberado"',
          'ped.desabilitado as "desabilitado"',
        ])
        .leftJoin("ped.clienteId", "a")
        .where("ped.id = :id", { id })
        .getRawOne()

      if (typeof pedidoBonificado === "undefined") {
        return noContent()
      }

      return ok(pedidoBonificado)
    } catch (err) {
      return serverError(err)
    }
  }

  // update
  async update({ id, clienteId, quantidade, data, isLiberado, desabilitado }: IPedidoBonificadoDTO): Promise<HttpResponse> {
    const pedidoBonificado = await this.repository.findOne(id)

    if (!pedidoBonificado) {
      return notFound()
    }

    const newpedidoBonificado = this.repository.create({
      id,
      clienteId,
      quantidade,
      data,
      isLiberado,
      desabilitado,
    })

    try {
      await this.repository.save(newpedidoBonificado)

      return ok(newpedidoBonificado)
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

  async getAllByClienteIdAndData(clienteId: string, dataInicio: Date, dataFim: Date): Promise<HttpResponse> {
    try {
      const pedidoBonificados = await this.repository.query(
        `
        SELECT 
          ped.id AS "id",
          ped.cliente_id AS "clienteId",
          a.nome AS "clienteNome",
          ped.quantidade AS "quantidade",
          ped.data AS "data",
          ped.is_liberado AS "isLiberado",
          ped.desabilitado AS "desabilitado"
        FROM 
          pedido_bonificado ped
        LEFT JOIN 
          Clientes a ON ped.cliente_id = a.id
        WHERE 
          ped.cliente_id = $1
        AND
          ped.data BETWEEN $2 AND $3
      `,
        [clienteId, dataInicio, dataFim]
      )

      return ok(pedidoBonificados)
    } catch (err) {
      return serverError(err)
    }
  }
}

export { PedidoBonificadoRepository }
