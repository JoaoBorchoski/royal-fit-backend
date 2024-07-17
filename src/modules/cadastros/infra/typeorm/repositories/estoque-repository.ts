import { Brackets, EntityManager, getRepository, Repository, TransactionManager } from "typeorm"
import { IEstoqueDTO } from "@modules/cadastros/dtos/i-estoque-dto"
import { IEstoqueRepository } from "@modules/cadastros/repositories/i-estoque-repository"
import { Estoque } from "@modules/cadastros/infra/typeorm/entities/estoque"
import { noContent, serverError, ok, notFound, HttpResponse } from "@shared/helpers"
import { AppError } from "@shared/errors/app-error"

class EstoqueRepository implements IEstoqueRepository {
  private repository: Repository<Estoque>

  constructor() {
    this.repository = getRepository(Estoque)
  }

  // create
  async create({ produtoId, quantidade, desabilitado }: IEstoqueDTO): Promise<HttpResponse> {
    const estoque = this.repository.create({
      produtoId,
      quantidade,
      desabilitado,
    })

    const result = await this.repository
      .save(estoque)
      .then((estoqueResult) => {
        return ok(estoqueResult)
      })
      .catch((error) => {
        return serverError(error)
      })

    return result
  }

  async createWithQueryRunner(
    { produtoId, quantidade, desabilitado }: IEstoqueDTO,
    @TransactionManager() transactionManager: EntityManager
  ): Promise<HttpResponse> {
    const estoque = transactionManager.create(Estoque, {
      produtoId,
      quantidade,
      desabilitado,
    })

    const result = await transactionManager
      .save(estoque)
      .then((estoqueResult) => {
        return ok(estoqueResult)
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

    const referenceArray = ["produtoNome", "quantidade"]
    const columnOrder = new Array<"ASC" | "DESC">(2).fill("ASC")

    const index = referenceArray.indexOf(columnName)

    columnOrder[index] = columnDirection

    const offset = rowsPerPage * page

    try {
      let query = this.repository
        .createQueryBuilder("est")
        .select(['est.id as "id"', 'a.id as "produtoId"', 'a.nome as "produtoNome"', 'est.quantidade as "quantidade"'])
        .leftJoin("est.produtoId", "a")

      if (filter) {
        query = query.where(filter)
      }

      const estoques = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(a.nome AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .addOrderBy("a.nome", columnOrder[0])
        .addOrderBy("est.quantidade", columnOrder[1])
        .offset(offset)
        .limit(rowsPerPage)
        .take(rowsPerPage)
        .getRawMany()

      return ok(estoques)
    } catch (err) {
      return serverError(err)
    }
  }

  // select
  async select(filter: string): Promise<HttpResponse> {
    try {
      const estoques = await this.repository
        .createQueryBuilder("est")
        .select(['est. as "value"', 'est. as "label"'])
        .where("est. ilike :filter", { filter: `${filter}%` })
        .addOrderBy("est.")
        .getRawMany()

      return ok(estoques)
    } catch (err) {
      return serverError(err)
    }
  }

  // id select
  async idSelect(id: string): Promise<HttpResponse> {
    try {
      const estoque = await this.repository
        .createQueryBuilder("est")
        .select(['est. as "value"', 'est. as "label"'])
        .where("est. = :id", { id: `${id}` })
        .getRawOne()

      return ok(estoque)
    } catch (err) {
      return serverError(err)
    }
  }

  // count
  async count(search: string, filter: string): Promise<HttpResponse> {
    try {
      let query = this.repository.createQueryBuilder("est").select(['est.id as "id"']).leftJoin("est.produtoId", "a")

      if (filter) {
        query = query.where(filter)
      }

      const estoques = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(a.nome AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .getRawMany()

      return ok({ count: estoques.length })
    } catch (err) {
      return serverError(err)
    }
  }

  // get
  async get(id: string): Promise<HttpResponse> {
    try {
      const estoque = await this.repository
        .createQueryBuilder("est")
        .select([
          'est.id as "id"',
          'est.produtoId as "produtoId"',
          'a.nome as "produtoNome"',
          'est.quantidade as "quantidade"',
          'est.desabilitado as "desabilitado"',
        ])
        .leftJoin("est.produtoId", "a")
        .where("est.id = :id", { id })
        .getRawOne()

      if (typeof estoque === "undefined") {
        return noContent()
      }

      return ok(estoque)
    } catch (err) {
      return serverError(err)
    }
  }

  async getByProdutoId(produtoId: string): Promise<HttpResponse> {
    try {
      const estoque = await this.repository.findOne({ where: { produtoId: produtoId } })

      return ok(estoque)
    } catch (error) {}
  }

  // update
  async update({ id, produtoId, quantidade, desabilitado }: IEstoqueDTO): Promise<HttpResponse> {
    const estoque = await this.repository.findOne(id)

    if (!estoque) {
      return notFound()
    }

    const newestoque = this.repository.create({
      id,
      produtoId,
      quantidade,
      desabilitado,
    })

    try {
      await this.repository.save(newestoque)

      return ok(newestoque)
    } catch (err) {
      return serverError(err)
    }
  }

  async updateEstoqueQuantidade(
    id: string,
    quantidade: number,
    @TransactionManager() transactionManager: EntityManager
  ): Promise<HttpResponse> {
    try {
      const estoque = await transactionManager.findOne(Estoque, id)
      estoque.quantidade = quantidade

      await transactionManager.save(estoque)

      return ok(estoque)
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

export { EstoqueRepository }
