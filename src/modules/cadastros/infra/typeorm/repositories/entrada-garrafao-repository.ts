import { Brackets, EntityManager, getRepository, Repository, TransactionManager } from "typeorm"

import { noContent, serverError, ok, notFound, HttpResponse } from "@shared/helpers"
import { AppError } from "@shared/errors/app-error"
import { IEntradaGarrafaoRepository } from "@modules/cadastros/repositories/i-entrada-garrafao-repository"
import { EntradaGarrafao } from "../entities/entrada-garrafao"
import { IEntradaGarrafaoDTO } from "@modules/cadastros/dtos/i-entrada-garrafao-dto"

class EntradaGarrafaoRepository implements IEntradaGarrafaoRepository {
  private repository: Repository<EntradaGarrafao>

  constructor() {
    this.repository = getRepository(EntradaGarrafao)
  }

  // create
  async create({ clienteId, quantidade, isRoyalfit, desabilitado }: IEntradaGarrafaoDTO): Promise<HttpResponse> {
    const entradaGarrafao = this.repository.create({
      clienteId,
      quantidade,
      isRoyalfit,
      desabilitado,
    })

    const result = await this.repository
      .save(entradaGarrafao)
      .then((entradaGarrafaoResult) => {
        return ok(entradaGarrafaoResult)
      })
      .catch((error) => {
        return serverError(error)
      })

    return result
  }

  async createWithQueryRunner(
    { clienteId, quantidade, isRoyalfit, tamanhoCasco, desabilitado }: IEntradaGarrafaoDTO,
    @TransactionManager() transactionManager: EntityManager
  ): Promise<HttpResponse> {
    const entradaGarrafao = transactionManager.create(EntradaGarrafao, {
      clienteId,
      quantidade,
      isRoyalfit,
      tamanhoCasco,
      desabilitado,
    })

    const result = await transactionManager
      .save(entradaGarrafao)
      .then((entradaGarrafaoResult) => {
        return ok(entradaGarrafaoResult)
      })
      .catch((error) => {
        console.log(error)
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

    const referenceArray = ["clienteName"]
    const columnOrder = new Array<"ASC" | "DESC">(2).fill("ASC")

    const index = referenceArray.indexOf(columnName)

    columnOrder[index] = columnDirection

    const offset = rowsPerPage * page

    try {
      let query = this.repository
        .createQueryBuilder("ent")
        .select(['ent.id as "id"', 'a.id as "clienteId"', 'a.name as "clienteName"'])
        .leftJoin("ent.clienteId", "a")

      if (filter) {
        query = query.where(filter)
      }

      const entradasGarrafao = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(a.name AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .addOrderBy("a.name", columnOrder[0])
        .offset(offset)
        .limit(rowsPerPage)
        .take(rowsPerPage)
        .getRawMany()

      return ok(entradasGarrafao)
    } catch (err) {
      return serverError(err)
    }
  }

  // select
  async select(filter: string, clienteId: string): Promise<HttpResponse> {
    try {
      const entradasGarrafao = await this.repository
        .createQueryBuilder("ent")
        .select([
          'ent.id as "value"',
          'ent.quantidade as "label"',
          "TO_CHAR(ent.createdAt, 'DD/MM/YYYY') as \"date\"",
          "CASE WHEN ent.isRoyalfit THEN 'Sim' ELSE 'Não' END as \"isRoyalfit\"",
          "CONCAT(ent.tamanhoCasco, 'L') as \"tamanhoCasco\"",
          'ent.clienteId as "clienteId"',
        ])
        .where("CAST(ent.quantidade as varchar) ilike :filter", { filter: `${filter}%` })
        .andWhere("ent.clienteId = :clienteId", { clienteId })
        .addOrderBy("ent.createdAt", "DESC")
        .getRawMany()

      return ok(entradasGarrafao)
    } catch (err) {
      console.log(err)
      return serverError(err)
    }
  }

  // id select
  async idSelect(id: string): Promise<HttpResponse> {
    try {
      const entradaGarrafao = await this.repository
        .createQueryBuilder("ent")
        .select(['ent. as "value"', 'ent. as "label"'])
        .where("ent. = :id", { id: `${id}` })
        .getRawOne()

      return ok(entradaGarrafao)
    } catch (err) {
      return serverError(err)
    }
  }

  // count
  async count(search: string, filter: string): Promise<HttpResponse> {
    try {
      let query = this.repository.createQueryBuilder("ent").select(['ent.id as "id"']).leftJoin("ent.clienteId", "a")

      if (filter) {
        query = query.where(filter)
      }

      const entradasGarrafao = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(a.name AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .getRawMany()

      return ok({ count: entradasGarrafao.length })
    } catch (err) {
      return serverError(err)
    }
  }

  // get
  async get(id: string): Promise<HttpResponse> {
    try {
      const entradaGarrafao = await this.repository
        .createQueryBuilder("ent")
        .select([
          'ent.id as "id"',
          'ent.clienteId as "clienteId"',
          'a.nome as "clienteNome"',
          'ent.quantidade as "quantidade"',
          'ent.isRoyalfit as "isRoyalfit"',
          'ent.tamanhoCasco as "tamanhoCasco"',
          'ent.desabilitado as "desabilitado"',
          'ent.createdAt as "data"',
        ])
        .leftJoin("ent.clienteId", "a")
        .where("ent.id = :id", { id })
        .getRawOne()

      if (typeof entradaGarrafao === "undefined") {
        return noContent()
      }

      return ok(entradaGarrafao)
    } catch (err) {
      console.log(err)
      return serverError(err)
    }
  }

  // update
  async update({ id, clienteId, quantidade, isRoyalfit, desabilitado }: IEntradaGarrafaoDTO): Promise<HttpResponse> {
    const entradaGarrafao = await this.repository.findOne(id)

    if (!entradaGarrafao) {
      return notFound()
    }

    const newentradaGarrafao = this.repository.create({
      id,
      clienteId,
      quantidade,
      isRoyalfit,
      desabilitado,
    })

    try {
      await this.repository.save(newentradaGarrafao)

      return ok(newentradaGarrafao)
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

  async getEntradasByDataAndCliente(dataInicio: Date, dataFim: Date, clienteId: string): Promise<HttpResponse> {
    try {
      const entradas = await this.repository
        .createQueryBuilder("ent")
        .select([
          'ent.id as "id"',
          'ent.createdAt as "data"',
          'ent.quantidade as "quantidade"',
          'ent.isRoyalfit as "isRoyalfit"',
          'ent.tamanhoCasco as "tamanhoCasco"',
        ])
        .leftJoin("ent.clienteId", "a")
        .where("ent.created_at >= :dataInicio", { dataInicio })
        .andWhere("ent.created_at <= :dataFim", { dataFim })
        .andWhere("a.id = :clienteId", { clienteId })
        .orderBy("ent.createdAt")
        .getRawMany()

      return ok(entradas)
    } catch (err) {
      console.log(err)
      return serverError(err)
    }
  }
}

export { EntradaGarrafaoRepository }
