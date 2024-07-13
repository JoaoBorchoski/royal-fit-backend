import { Brackets, EntityManager, getRepository, Repository, TransactionManager } from "typeorm"
import { IGarrafaoDTO } from "@modules/cadastros/dtos/i-garrafao-dto"
import { IGarrafaoRepository } from "@modules/cadastros/repositories/i-garrafao-repository"
import { Garrafao } from "@modules/cadastros/infra/typeorm/entities/garrafao"
import { noContent, serverError, ok, notFound, HttpResponse } from "@shared/helpers"
import { AppError } from "@shared/errors/app-error"

class GarrafaoRepository implements IGarrafaoRepository {
  private repository: Repository<Garrafao>

  constructor() {
    this.repository = getRepository(Garrafao)
  }

  // create
  async create({ clienteId, quantidade, desabilitado }: IGarrafaoDTO): Promise<HttpResponse> {
    const garrafao = this.repository.create({
      clienteId,
      quantidade,
      desabilitado,
    })

    const result = await this.repository
      .save(garrafao)
      .then((garrafaoResult) => {
        return ok(garrafaoResult)
      })
      .catch((error) => {
        return serverError(error)
      })

    return result
  }

  async createWithQueryRunner(
    { clienteId, quantidade, desabilitado }: IGarrafaoDTO,
    @TransactionManager() transactionManager: EntityManager
  ): Promise<HttpResponse> {
    const garrafao = transactionManager.create(Garrafao, {
      clienteId,
      quantidade,
      desabilitado,
    })

    const result = await transactionManager
      .save(garrafao)
      .then((garrafaoResult) => {
        return ok(garrafaoResult)
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

    const referenceArray = ["clienteNome", "quantidade"]
    const columnOrder = new Array<"ASC" | "DESC">(2).fill("ASC")

    const index = referenceArray.indexOf(columnName)

    columnOrder[index] = columnDirection

    const offset = rowsPerPage * page

    try {
      let query = this.repository
        .createQueryBuilder("gar")
        .select(['gar.id as "id"', 'a.id as "clienteId"', 'a.nome as "clienteNome"', 'gar.quantidade as "quantidade"'])
        .leftJoin("gar.clienteId", "a")

      if (filter) {
        query = query.where(filter)
      }

      const garrafoes = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(a.nome AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .addOrderBy("a.nome", columnOrder[0])
        .addOrderBy("gar.quantidade", columnOrder[1])
        .offset(offset)
        .limit(rowsPerPage)
        .take(rowsPerPage)
        .getRawMany()

      return ok(garrafoes)
    } catch (err) {
      return serverError(err)
    }
  }

  // select
  async select(filter: string): Promise<HttpResponse> {
    try {
      const garrafoes = await this.repository
        .createQueryBuilder("gar")
        .select(['gar. as "value"', 'gar. as "label"'])
        .where("gar. ilike :filter", { filter: `${filter}%` })
        .addOrderBy("gar.")
        .getRawMany()

      return ok(garrafoes)
    } catch (err) {
      return serverError(err)
    }
  }

  // id select
  async idSelect(id: string): Promise<HttpResponse> {
    try {
      const garrafao = await this.repository
        .createQueryBuilder("gar")
        .select(['gar. as "value"', 'gar. as "label"'])
        .where("gar. = :id", { id: `${id}` })
        .getRawOne()

      return ok(garrafao)
    } catch (err) {
      return serverError(err)
    }
  }

  // count
  async count(search: string, filter: string): Promise<HttpResponse> {
    try {
      let query = this.repository.createQueryBuilder("gar").select(['gar.id as "id"']).leftJoin("gar.clienteId", "a")

      if (filter) {
        query = query.where(filter)
      }

      const garrafoes = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(a.nome AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .getRawMany()

      return ok({ count: garrafoes.length })
    } catch (err) {
      return serverError(err)
    }
  }

  // get
  async get(id: string): Promise<HttpResponse> {
    try {
      const garrafao = await this.repository
        .createQueryBuilder("gar")
        .select([
          'gar.id as "id"',
          'gar.clienteId as "clienteId"',
          'a.nome as "clienteNome"',
          'gar.quantidade as "quantidade"',
          'gar.desabilitado as "desabilitado"',
        ])
        .leftJoin("gar.clienteId", "a")
        .where("gar.id = :id", { id })
        .getRawOne()

      if (typeof garrafao === "undefined") {
        return noContent()
      }

      return ok(garrafao)
    } catch (err) {
      return serverError(err)
    }
  }

  // update
  async update({ id, clienteId, quantidade, desabilitado }: IGarrafaoDTO): Promise<HttpResponse> {
    const garrafao = await this.repository.findOne(id)

    if (!garrafao) {
      return notFound()
    }

    const newgarrafao = this.repository.create({
      id,
      clienteId,
      quantidade,
      desabilitado,
    })

    try {
      await this.repository.save(newgarrafao)

      return ok(newgarrafao)
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

export { GarrafaoRepository }
