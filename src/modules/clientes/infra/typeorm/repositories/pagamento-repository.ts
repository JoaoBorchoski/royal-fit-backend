import { Brackets, getRepository, Repository } from "typeorm"
import { IPagamentoDTO } from "@modules/clientes/dtos/i-pagamento-dto"
import { IPagamentoRepository } from "@modules/clientes/repositories/i-pagamento-repository"
import { Pagamento } from "@modules/clientes/infra/typeorm/entities/pagamento"
import { noContent, serverError, ok, notFound, HttpResponse } from "@shared/helpers"
import { AppError } from "@shared/errors/app-error"

class PagamentoRepository implements IPagamentoRepository {
  private repository: Repository<Pagamento>

  constructor() {
    this.repository = getRepository(Pagamento)
  }

  // create
  async create({ clienteId, valorPago, meioPagamentoId, data, desabilitado }: IPagamentoDTO): Promise<HttpResponse> {
    const pagamento = this.repository.create({
      clienteId,
      valorPago,
      meioPagamentoId,
      data,
      desabilitado,
    })

    const result = await this.repository
      .save(pagamento)
      .then((pagamentoResult) => {
        return ok(pagamentoResult)
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

    const referenceArray = ["clienteNome", "valorPago"]
    const columnOrder = new Array<"ASC" | "DESC">(2).fill("ASC")

    const index = referenceArray.indexOf(columnName)

    columnOrder[index] = columnDirection

    const offset = rowsPerPage * page

    try {
      let query = this.repository
        .createQueryBuilder("pag")
        .select(['pag.id as "id"', 'a.id as "clienteId"', 'a.nome as "clienteNome"', 'pag.valorPago as "valorPago"'])
        .leftJoin("pag.clienteId", "a")

      if (filter) {
        query = query.where(filter)
      }

      const pagamentos = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(a.nome AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .addOrderBy("a.nome", columnOrder[0])
        .addOrderBy("pag.valorPago", columnOrder[1])
        .offset(offset)
        .limit(rowsPerPage)
        .take(rowsPerPage)
        .getRawMany()

      return ok(pagamentos)
    } catch (err) {
      return serverError(err)
    }
  }

  // select
  async select(filter: string): Promise<HttpResponse> {
    try {
      const pagamentos = await this.repository
        .createQueryBuilder("pag")
        .select(['pag. as "value"', 'pag. as "label"'])
        .where("pag. ilike :filter", { filter: `${filter}%` })
        .addOrderBy("pag.")
        .getRawMany()

      return ok(pagamentos)
    } catch (err) {
      return serverError(err)
    }
  }

  // id select
  async idSelect(id: string): Promise<HttpResponse> {
    try {
      const pagamento = await this.repository
        .createQueryBuilder("pag")
        .select(['pag. as "value"', 'pag. as "label"'])
        .where("pag. = :id", { id: `${id}` })
        .getRawOne()

      return ok(pagamento)
    } catch (err) {
      return serverError(err)
    }
  }

  // count
  async count(search: string, filter: string): Promise<HttpResponse> {
    try {
      let query = this.repository.createQueryBuilder("pag").select(['pag.id as "id"']).leftJoin("pag.clienteId", "a")

      if (filter) {
        query = query.where(filter)
      }

      const pagamentos = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(a.nome AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .getRawMany()

      return ok({ count: pagamentos.length })
    } catch (err) {
      return serverError(err)
    }
  }

  // get
  async get(id: string): Promise<HttpResponse> {
    try {
      const pagamento = await this.repository
        .createQueryBuilder("pag")
        .select([
          'pag.id as "id"',
          'pag.clienteId as "clienteId"',
          'a.nome as "clienteNome"',
          'pag.valorPago as "valorPago"',
          'pag.meioPagamentoId as "meioPagamentoId"',
          'b.nome as "statusPagamentoNome"',
          'pag.desabilitado as "desabilitado"',
        ])
        .leftJoin("pag.clienteId", "a")
        .leftJoin("pag.meioPagamentoId", "b")
        .where("pag.id = :id", { id })
        .getRawOne()

      if (typeof pagamento === "undefined") {
        return noContent()
      }

      return ok(pagamento)
    } catch (err) {
      return serverError(err)
    }
  }

  async getByClienteId(clienteId: string): Promise<HttpResponse> {
    try {
      const pagamento = await this.repository
        .createQueryBuilder("pag")
        .select([
          'pag.id as "id"',
          'pag.clienteId as "clienteId"',
          'a.nome as "clienteNome"',
          'pag.valorPago as "valorPago"',
          'pag.meioPagamentoId as "meioPagamentoId"',
          'b.nome as "statusPagamentoNome"',
          'pag.desabilitado as "desabilitado"',
        ])
        .leftJoin("pag.clienteId", "a")
        .leftJoin("pag.meioPagamentoId", "b")
        .where("pag.clienteId = :clienteId", { clienteId })
        .getRawOne()

      if (typeof pagamento === "undefined") {
        return noContent()
      }

      return ok(pagamento)
    } catch (err) {
      return serverError(err)
    }
  }

  // update
  async update({ id, clienteId, valorPago, meioPagamentoId, desabilitado }: IPagamentoDTO): Promise<HttpResponse> {
    const pagamento = await this.repository.findOne(id)

    if (!pagamento) {
      return notFound()
    }

    const newpagamento = this.repository.create({
      id,
      clienteId,
      valorPago,
      meioPagamentoId,
      desabilitado,
    })

    try {
      await this.repository.save(newpagamento)

      return ok(newpagamento)
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

  async getPagamentosByDataAndCliente(dataInicio: Date, dataFim: Date, clienteId: string): Promise<HttpResponse> {
    try {
      const pedidos = await this.repository.query(
        `
        SELECT 
          p.id AS "id",
          p.data AS "data",
          p.valor_pago :: float AS "valorPago",
          mp.nome AS "meioPagamento"
        FROM 
          Pagamentos p
        LEFT JOIN
          Clientes c ON p.cliente_id = c.id
        LEFT JOIN
          meios_pagamento mp ON p.meio_pagamento_id = mp.id
        WHERE 
          p.data BETWEEN $1 AND $2
        AND
          c.id = $3
      `,
        [dataInicio, dataFim, clienteId]
      )

      return ok(pedidos)
    } catch (err) {
      return serverError(err)
    }
  }
}

export { PagamentoRepository }
