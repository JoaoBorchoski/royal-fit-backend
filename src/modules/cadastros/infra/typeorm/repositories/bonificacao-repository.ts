import { Brackets, EntityManager, getRepository, Repository, TransactionManager } from "typeorm"
import { IBonificacaoDTO } from "@modules/cadastros/dtos/i-bonificacao-dto"
import { IBonificacaoRepository } from "@modules/cadastros/repositories/i-bonificacao-repository"
import { Bonificacao } from "@modules/cadastros/infra/typeorm/entities/bonificacao"
import { noContent, serverError, ok, notFound, HttpResponse } from "@shared/helpers"
import { AppError } from "@shared/errors/app-error"

class BonificacaoRepository implements IBonificacaoRepository {
  private repository: Repository<Bonificacao>

  constructor() {
    this.repository = getRepository(Bonificacao)
  }

  // create
  async create({ clienteId, totalVendido, bonificacaoDisponivel, desabilitado }: IBonificacaoDTO): Promise<HttpResponse> {
    const bonificacao = this.repository.create({
      clienteId,
      totalVendido,
      bonificacaoDisponivel,
      desabilitado,
    })

    const result = await this.repository
      .save(bonificacao)
      .then((bonificacaoResult) => {
        return ok(bonificacaoResult)
      })
      .catch((error) => {
        return serverError(error)
      })

    return result
  }

  async createWithQueryRunner(
    { clienteId, totalVendido, bonificacaoDisponivel, desabilitado }: IBonificacaoDTO,
    @TransactionManager() transactionManager: EntityManager
  ): Promise<HttpResponse> {
    const bonificacao = transactionManager.create(Bonificacao, {
      clienteId,
      totalVendido,
      bonificacaoDisponivel,
      desabilitado,
    })

    const result = await transactionManager
      .save(bonificacao)
      .then((bonificacaoResult) => {
        return ok(bonificacaoResult)
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

    const referenceArray = ["clienteNome", "totalVendido", "bonificacaoDisponivel"]
    const columnOrder = new Array<"ASC" | "DESC">(2).fill("ASC")

    const index = referenceArray.indexOf(columnName)

    columnOrder[index] = columnDirection

    const offset = rowsPerPage * page

    try {
      let query = this.repository
        .createQueryBuilder("bon")
        .select([
          'bon.id as "id"',
          'a.id as "clienteId"',
          'a.nome as "clienteNome"',
          'bon.totalVendido as "totalVendido"',
          'bon.bonificacaoDisponivel as "bonificacaoDisponivel"',
        ])
        .where("a.isBonificado = true")
        .leftJoin("bon.clienteId", "a")

      if (filter) {
        query = query.where(filter)
      }

      const bonificacoes = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(a.nome AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .addOrderBy("a.nome", columnOrder[0])
        .addOrderBy("bon.totalVendido", columnOrder[1])
        .addOrderBy("bon.bonificacaoDisponivel", columnOrder[2])
        .offset(offset)
        .limit(rowsPerPage)
        .take(rowsPerPage)
        .getRawMany()

      return ok(bonificacoes)
    } catch (err) {
      return serverError(err)
    }
  }

  // select
  async select(filter: string): Promise<HttpResponse> {
    try {
      const bonificacoes = await this.repository
        .createQueryBuilder("bon")
        .select(['bon. as "value"', 'bon. as "label"'])
        .where("bon. ilike :filter", { filter: `${filter}%` })
        .addOrderBy("bon.")
        .getRawMany()

      return ok(bonificacoes)
    } catch (err) {
      return serverError(err)
    }
  }

  // id select
  async idSelect(id: string): Promise<HttpResponse> {
    try {
      const bonificacao = await this.repository
        .createQueryBuilder("bon")
        .select(['bon. as "value"', 'bon. as "label"'])
        .where("bon. = :id", { id: `${id}` })
        .getRawOne()

      return ok(bonificacao)
    } catch (err) {
      return serverError(err)
    }
  }

  // count
  async count(search: string, filter: string): Promise<HttpResponse> {
    try {
      let query = this.repository.createQueryBuilder("bon").select(['bon.id as "id"']).leftJoin("bon.clienteId", "a")

      if (filter) {
        query = query.where(filter)
      }

      const bonificacoes = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(a.nome AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .getRawMany()

      return ok({ count: bonificacoes.length })
    } catch (err) {
      return serverError(err)
    }
  }

  // get
  async get(id: string): Promise<HttpResponse> {
    try {
      const bonificacao = await this.repository
        .createQueryBuilder("bon")
        .select([
          'bon.id as "id"',
          'bon.clienteId as "clienteId"',
          'a.nome as "clienteNome"',
          'bon.totalVendido as "totalVendido"',
          'bon.bonificacaoDisponivel as "bonificacaoDisponivel"',
          'bon.desabilitado as "desabilitado"',
        ])
        .leftJoin("bon.clienteId", "a")
        .where("bon.id = :id", { id })
        .getRawOne()

      if (typeof bonificacao === "undefined") {
        return noContent()
      }

      return ok(bonificacao)
    } catch (err) {
      return serverError(err)
    }
  }

  async getByClienteId(clienteId: string): Promise<HttpResponse> {
    try {
      const bonificacao = await this.repository
        .createQueryBuilder("bon")
        .select([
          'bon.id as "id"',
          'bon.clienteId as "clienteId"',
          'a.nome as "clienteNome"',
          'bon.totalVendido as "totalVendido"',
          'bon.bonificacaoDisponivel as "bonificacaoDisponivel"',
          'bon.desabilitado as "desabilitado"',
        ])
        .leftJoin("bon.clienteId", "a")
        .where("bon.clienteId = :clienteId", { clienteId })
        .getRawOne()

      return ok(bonificacao)
    } catch (err) {
      return serverError(err)
    }
  }

  async getByClienteIdWithQueryRunner(
    clienteId: string,
    @TransactionManager() transactionManager: EntityManager
  ): Promise<HttpResponse> {
    try {
      const bonificacao = await transactionManager
        .createQueryBuilder(Bonificacao, "bon")
        .select([
          'bon.id as "id"',
          'bon.clienteId as "clienteId"',
          'a.nome as "clienteNome"',
          'bon.totalVendido as "totalVendido"',
          'bon.bonificacaoDisponivel as "bonificacaoDisponivel"',
          'bon.desabilitado as "desabilitado"',
        ])
        .leftJoin("bon.clienteId", "a")
        .where("bon.clienteId = :clienteId", { clienteId })
        .getRawOne()

      return ok(bonificacao)
    } catch (err) {
      return serverError(err)
    }
  }

  // update
  async update({ id, clienteId, totalVendido, bonificacaoDisponivel, desabilitado }: IBonificacaoDTO): Promise<HttpResponse> {
    const bonificacao = await this.repository.findOne(id)

    if (!bonificacao) {
      return notFound()
    }

    const newbonificacao = this.repository.create({
      id,
      clienteId,
      totalVendido,
      bonificacaoDisponivel,
      desabilitado,
    })

    try {
      await this.repository.save(newbonificacao)

      return ok(newbonificacao)
    } catch (err) {
      return serverError(err)
    }
  }

  async updateWithQueryRunner(
    { id, clienteId, totalVendido, bonificacaoDisponivel, desabilitado }: IBonificacaoDTO,
    @TransactionManager() transactionManager: EntityManager
  ): Promise<HttpResponse> {
    const bonificacao = await transactionManager.findOne(Bonificacao, id)

    if (!bonificacao) {
      return notFound()
    }

    const newbonificacao = transactionManager.create(Bonificacao, {
      id,
      clienteId,
      totalVendido,
      bonificacaoDisponivel,
      desabilitado,
    })

    try {
      await transactionManager.save(newbonificacao)

      return ok(newbonificacao)
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

export { BonificacaoRepository }
