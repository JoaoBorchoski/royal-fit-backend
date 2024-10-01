import { Brackets, getRepository, Repository } from "typeorm"
import { IDescontoDTO } from "@modules/clientes/dtos/i-desconto-dto"
import { IDescontoRepository } from "@modules/clientes/repositories/i-desconto-repository"
import { Desconto } from "@modules/clientes/infra/typeorm/entities/desconto"
import { noContent, serverError, ok, notFound, HttpResponse } from "@shared/helpers"
import { AppError } from "@shared/errors/app-error"

class DescontoRepository implements IDescontoRepository {
  private repository: Repository<Desconto>

  constructor() {
    this.repository = getRepository(Desconto)
  }

  // create
  async create({ clienteId, produtoId, desconto, desabilitado }: IDescontoDTO): Promise<HttpResponse> {
    const desc = this.repository.create({
      clienteId,
      produtoId,
      desconto,
      desabilitado,
    })

    const result = await this.repository
      .save(desc)
      .then((descontoResult) => {
        return ok(descontoResult)
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

    const referenceArray = ["clienteNome"]
    const columnOrder = new Array<"ASC" | "DESC">(2).fill("ASC")

    const index = referenceArray.indexOf(columnName)

    columnOrder[index] = columnDirection

    const offset = rowsPerPage * page

    try {
      let query = this.repository
        .createQueryBuilder("des")
        .select(['des.id as "id"', 'a.id as "clienteId"', 'a.nome as "clienteNome"'])
        .leftJoin("des.clienteId", "a")

      if (filter) {
        query = query.where(filter)
      }

      const descontos = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(a.nome AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .addOrderBy("a.nome", columnOrder[0])
        .offset(offset)
        .limit(rowsPerPage)
        .take(rowsPerPage)
        .getRawMany()

      return ok(descontos)
    } catch (err) {
      return serverError(err)
    }
  }

  // select
  async select(filter: string): Promise<HttpResponse> {
    try {
      const descontos = await this.repository
        .createQueryBuilder("des")
        .select(['des.id as "value"', 'des.clienteId as "label"'])
        .where("des.clienteId ilike :filter", { filter: `${filter}%` })
        .addOrderBy("des.clienteId")
        .getRawMany()

      return ok(descontos)
    } catch (err) {
      return serverError(err)
    }
  }

  // id select
  async idSelect(id: string): Promise<HttpResponse> {
    try {
      const desconto = await this.repository
        .createQueryBuilder("des")
        .select(['des.id as "value"', 'des.clienteId as "label"'])
        .where("des.id = :id", { id: `${id}` })
        .getRawOne()

      return ok(desconto)
    } catch (err) {
      return serverError(err)
    }
  }

  // count
  async count(search: string, filter: string): Promise<HttpResponse> {
    try {
      let query = this.repository.createQueryBuilder("des").select(['des.id as "id"']).leftJoin("des.clienteId", "a")

      if (filter) {
        query = query.where(filter)
      }

      const descontos = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(a.nome AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .getRawMany()

      return ok({ count: descontos.length })
    } catch (err) {
      return serverError(err)
    }
  }

  // get
  async get(id: string): Promise<HttpResponse> {
    try {
      const desconto = await this.repository
        .createQueryBuilder("des")
        .select([
          'des.id as "id"',
          'des.clienteId as "clienteId"',
          'a.nome as "clienteNome"',
          'des.produtoId as "produtoId"',
          'b.nome as "produtoNome"',
          'des.desconto as "desconto"',
          'des.desabilitado as "desabilitado"',
        ])
        .leftJoin("des.clienteId", "a")
        .leftJoin("des.produtoId", "b")
        .where("des.id = :id", { id })
        .getRawOne()

      if (typeof desconto === "undefined") {
        return noContent()
      }

      return ok(desconto)
    } catch (err) {
      return serverError(err)
    }
  }

  // update
  async update({ id, clienteId, produtoId, desconto, desabilitado }: IDescontoDTO): Promise<HttpResponse> {
    const desc = await this.repository.findOne(id)

    if (!desc) {
      return notFound()
    }

    const newdesconto = this.repository.create({
      id,
      clienteId,
      produtoId,
      desconto,
      desabilitado,
    })

    try {
      await this.repository.save(newdesconto)

      return ok(newdesconto)
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

  async deleteByClienteId(clienteId: string): Promise<HttpResponse> {
    try {
      await this.repository.delete({ clienteId: clienteId })

      return noContent()
    } catch (err) {
      return serverError(err)
    }
  }
}

export { DescontoRepository }
