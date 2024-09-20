import { Brackets, EntityManager, getRepository, Repository, TransactionManager } from "typeorm"
import { IBalancoDTO } from "@modules/clientes/dtos/i-balanco-dto"
import { IBalancoRepository } from "@modules/clientes/repositories/i-balanco-repository"
import { Balanco } from "@modules/clientes/infra/typeorm/entities/balanco"
import { noContent, serverError, ok, notFound, HttpResponse } from "@shared/helpers"
import { AppError } from "@shared/errors/app-error"

class BalancoRepository implements IBalancoRepository {
  private repository: Repository<Balanco>

  constructor() {
    this.repository = getRepository(Balanco)
  }

  // create
  async create({ clienteId, saldoDevedor, desabilitado }: IBalancoDTO): Promise<HttpResponse> {
    const balanco = this.repository.create({
      clienteId,
      saldoDevedor,
      desabilitado,
    })

    const result = await this.repository
      .save(balanco)
      .then((balancoResult) => {
        return ok(balancoResult)
      })
      .catch((error) => {
        return serverError(error)
      })

    return result
  }

  async createWithQueryRunner(
    { clienteId, saldoDevedor, desabilitado }: IBalancoDTO,
    @TransactionManager() transactionManager: EntityManager
  ): Promise<HttpResponse> {
    const balanco = transactionManager.create(Balanco, {
      clienteId,
      saldoDevedor,
      desabilitado,
    })

    const result = await transactionManager
      .save(balanco)
      .then((balancoResult) => {
        return ok(balancoResult)
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

    const referenceArray = ["clienteNome", "saldoDevedor"]
    const columnOrder = new Array<"ASC" | "DESC">(2).fill("ASC")

    const index = referenceArray.indexOf(columnName)

    columnOrder[index] = columnDirection

    const offset = rowsPerPage * page

    try {
      let query = this.repository
        .createQueryBuilder("bal")
        .select([
          'bal.id as "id"',
          'a.id as "clienteId"',
          'a.nome as "clienteNome"',
          'bal.saldoDevedor as "saldoDevedor"',
          'gar.quantidade as "garrafoesDisponivel"',
          // 'bon.bonificacaoDisponivel as "bonificacaoDisponivel"',
          'CASE WHEN a.isBonificado THEN bon.bonificacaoDisponivel ELSE 0 END as "bonificacaoDisponivel"',
        ])
        .leftJoin("bal.clienteId", "a")
        .leftJoin("bonificacoes", "bon", "bon.clienteId = a.id")
        .leftJoin("garrafoes", "gar", "gar.clienteId = a.id")

      if (filter) {
        query = query.where(filter)
      }

      const balancos = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(a.nome AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .addOrderBy("a.nome", columnOrder[0])
        .addOrderBy("bal.saldoDevedor", columnOrder[1])
        .offset(offset)
        .limit(rowsPerPage)
        .take(rowsPerPage)
        .getRawMany()

      return ok(balancos)
    } catch (err) {
      return serverError(err)
    }
  }

  // select
  async select(filter: string): Promise<HttpResponse> {
    try {
      const balancos = await this.repository
        .createQueryBuilder("bal")
        .select(['bal. as "value"', 'bal. as "label"'])
        .where("bal. ilike :filter", { filter: `${filter}%` })
        .addOrderBy("bal.")
        .getRawMany()

      return ok(balancos)
    } catch (err) {
      return serverError(err)
    }
  }

  // id select
  async idSelect(id: string): Promise<HttpResponse> {
    try {
      const balanco = await this.repository
        .createQueryBuilder("bal")
        .select(['bal. as "value"', 'bal. as "label"'])
        .where("bal. = :id", { id: `${id}` })
        .getRawOne()

      return ok(balanco)
    } catch (err) {
      return serverError(err)
    }
  }

  // count
  async count(search: string, filter: string): Promise<HttpResponse> {
    try {
      let query = this.repository.createQueryBuilder("bal").select(['bal.id as "id"']).leftJoin("bal.clienteId", "a")

      if (filter) {
        query = query.where(filter)
      }

      const balancos = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(a.nome AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .getRawMany()

      return ok({ count: balancos.length })
    } catch (err) {
      return serverError(err)
    }
  }

  // get
  async get(id: string): Promise<HttpResponse> {
    try {
      const balanco = await this.repository
        .createQueryBuilder("bal")
        .select([
          'bal.id as "id"',
          'bal.clienteId as "clienteId"',
          'a.nome as "clienteNome"',
          'bal.saldoDevedor :: float as "saldoDevedor"',
          'bal.desabilitado as "desabilitado"',
          "bon.bonificacaoDisponivel as bonificacaoDisponivel",
          'gar.quantidade as "garrafoesDisponivel"',
          'a.isBonificado as "isBonificado"',
        ])
        .leftJoin("bal.clienteId", "a")
        .leftJoin("bonificacoes", "bon", "bon.clienteId = a.id")
        .leftJoin("garrafoes", "gar", "gar.clienteId = a.id")
        .where("bal.id = :id", { id })
        .getRawOne()

      if (typeof balanco === "undefined") {
        return noContent()
      }

      return ok(balanco)
    } catch (err) {
      return serverError(err)
    }
  }

  async getByClienteId(clienteId: string): Promise<HttpResponse> {
    try {
      const balanco = await this.repository
        .createQueryBuilder("bal")
        .select([
          'bal.id as "id"',
          'bal.clienteId as "clienteId"',
          'bal.saldoDevedor :: float as "saldoDevedor"',
          'bal.desabilitado as "desabilitado"',
        ])
        .where("bal.clienteId = :clienteId", { clienteId })
        .getRawOne()

      return ok(balanco)
    } catch (error) {
      return serverError(error)
    }
  }

  async getByClienteIdWithQueryRunner(clienteId: string, @TransactionManager() transactionManager: EntityManager): Promise<HttpResponse> {
    try {
      const balanco = await transactionManager
        .createQueryBuilder(Balanco, "bal")
        .select([
          'bal.id as "id"',
          'bal.clienteId as "clienteId"',
          'bal.saldoDevedor :: float as "saldoDevedor"',
          'bal.desabilitado as "desabilitado"',
        ])
        .where("bal.clienteId = :clienteId", { clienteId })
        .getRawOne()

      return ok(balanco)
    } catch (error) {
      return serverError(error)
    }
  }

  // update
  async update({ id, clienteId, saldoDevedor, desabilitado }: IBalancoDTO): Promise<HttpResponse> {
    const balanco = await this.repository.findOne(id)

    if (!balanco) {
      return notFound()
    }

    const newbalanco = this.repository.create({
      id,
      clienteId,
      saldoDevedor,
      desabilitado,
    })

    try {
      await this.repository.save(newbalanco)

      return ok(newbalanco)
    } catch (err) {
      return serverError(err)
    }
  }

  async updateWithQueryRunner(
    { id, clienteId, saldoDevedor, desabilitado }: IBalancoDTO,
    @TransactionManager() transactionManager: EntityManager
  ): Promise<HttpResponse> {
    const balanco = await transactionManager.findOne(Balanco, id)

    if (!balanco) {
      return notFound()
    }

    const newbalanco = transactionManager.create(Balanco, {
      id,
      clienteId,
      saldoDevedor,
      desabilitado,
    })

    try {
      await transactionManager.save(newbalanco)

      return ok(newbalanco)
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

export { BalancoRepository }
