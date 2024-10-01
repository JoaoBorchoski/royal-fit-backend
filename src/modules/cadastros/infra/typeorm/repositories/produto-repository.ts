import { Brackets, EntityManager, getRepository, Repository, TransactionManager } from "typeorm"
import { IProdutoDTO } from "@modules/cadastros/dtos/i-produto-dto"
import { IProdutoRepository } from "@modules/cadastros/repositories/i-produto-repository"
import { Produto } from "@modules/cadastros/infra/typeorm/entities/produto"
import { noContent, serverError, ok, notFound, HttpResponse } from "@shared/helpers"
import { AppError } from "@shared/errors/app-error"

class ProdutoRepository implements IProdutoRepository {
  private repository: Repository<Produto>

  constructor() {
    this.repository = getRepository(Produto)
  }

  // create
  async create({ nome, preco, descricao, desabilitado }: IProdutoDTO): Promise<HttpResponse> {
    const produto = this.repository.create({
      nome,
      preco,
      descricao,
      desabilitado,
    })

    const result = await this.repository
      .save(produto)
      .then((produtoResult) => {
        return ok(produtoResult)
      })
      .catch((error) => {
        return serverError(error)
      })

    return result
  }

  async createWithQueryRunner(
    { nome, preco, descricao, desabilitado }: IProdutoDTO,
    @TransactionManager() transactionManager: EntityManager
  ): Promise<HttpResponse> {
    const produto = transactionManager.create(Produto, {
      nome,
      preco,
      descricao,
      desabilitado,
    })

    const result = await transactionManager
      .save(produto)
      .then((produtoResult) => {
        return ok(produtoResult)
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

    const referenceArray = ["nome", "preco", "descricao"]
    const columnOrder = new Array<"ASC" | "DESC">(2).fill("ASC")

    const index = referenceArray.indexOf(columnName)

    columnOrder[index] = columnDirection

    const offset = rowsPerPage * page

    try {
      let query = this.repository
        .createQueryBuilder("pro")
        .select(['pro.id as "id"', 'pro.nome as "nome"', 'pro.preco as "preco"', 'pro.descricao as "descricao"'])

      if (filter) {
        query = query.where(filter)
      }

      const produtos = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(pro.nome AS VARCHAR) ilike :search", { search: `%${search}%` })
            query.orWhere("CAST(pro.descricao AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .andWhere("pro.desabilitado = false")
        .addOrderBy("pro.nome", columnOrder[0])
        .addOrderBy("pro.preco", columnOrder[1])
        .addOrderBy("pro.descricao", columnOrder[2])
        .offset(offset)
        .limit(rowsPerPage)
        .take(rowsPerPage)
        .getRawMany()

      return ok(produtos)
    } catch (err) {
      return serverError(err)
    }
  }

  // select
  async select(filter: string): Promise<HttpResponse> {
    try {
      const produtos = await this.repository
        .createQueryBuilder("pro")
        .select(['pro.id as "value"', 'pro.nome as "label"'])
        .where("pro.nome ilike :filter", { filter: `%${filter}%` })
        .addOrderBy("pro.nome")
        .getRawMany()

      return ok(produtos)
    } catch (err) {
      return serverError(err)
    }
  }

  async selectWithOutDesabilitado(filter: string): Promise<HttpResponse> {
    try {
      const produtos = await this.repository
        .createQueryBuilder("pro")
        .select(['pro.id as "value"', 'pro.nome as "label"'])
        .where("pro.nome ilike :filter", { filter: `%${filter}%` })
        .andWhere("pro.desabilitado = false")
        .addOrderBy("pro.nome")
        .getRawMany()

      return ok(produtos)
    } catch (err) {
      return serverError(err)
    }
  }

  // id select
  async idSelect(id: string): Promise<HttpResponse> {
    try {
      const produto = await this.repository
        .createQueryBuilder("pro")
        .select(['pro.id as "value"', 'pro.nome as "label"'])
        .where("pro.id = :id", { id: `${id}` })
        .getRawOne()

      return ok(produto)
    } catch (err) {
      return serverError(err)
    }
  }

  // count
  async count(search: string, filter: string): Promise<HttpResponse> {
    try {
      let query = this.repository.createQueryBuilder("pro").select(['pro.id as "id"'])

      if (filter) {
        query = query.where(filter)
      }

      const produtos = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(pro.nome AS VARCHAR) ilike :search", { search: `%${search}%` })
            query.orWhere("CAST(pro.descricao AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .getRawMany()

      return ok({ count: produtos.length })
    } catch (err) {
      return serverError(err)
    }
  }

  // get
  async get(id: string): Promise<HttpResponse> {
    try {
      const produto = await this.repository
        .createQueryBuilder("pro")
        .select([
          'pro.id as "id"',
          'pro.nome as "nome"',
          'pro.preco as "preco"',
          'pro.descricao as "descricao"',
          'pro.desabilitado as "desabilitado"',
        ])
        .where("pro.id = :id", { id })
        .getRawOne()

      if (typeof produto === "undefined") {
        return noContent()
      }

      return ok(produto)
    } catch (err) {
      return serverError(err)
    }
  }

  async getByname(nome: string): Promise<HttpResponse> {
    const nomeRegex = nome.split(" ").join(".*")

    try {
      const produto = await this.repository
        .createQueryBuilder("pro")
        .select([
          'pro.id as "id"',
          'pro.nome as "nome"',
          'pro.preco as "preco"',
          'pro.descricao as "descricao"',
          'pro.desabilitado as "desabilitado"',
        ])
        // .where("CAST(pro.nome AS VARCHAR) ilike :nome", { nome: `%${nome}%` })
        .where("pro.nome ~* :nome", { nome: nomeRegex })
        .getRawOne()

      if (typeof produto === "undefined") {
        return noContent()
      }

      return ok(produto)
    } catch (err) {
      return serverError(err)
    }
  }

  // update
  async update({ id, nome, preco, descricao, desabilitado }: IProdutoDTO): Promise<HttpResponse> {
    const produto = await this.repository.findOne(id)

    if (!produto) {
      return notFound()
    }

    const newproduto = this.repository.create({
      id,
      nome,
      preco,
      descricao,
      desabilitado,
    })

    try {
      await this.repository.save(newproduto)

      return ok(newproduto)
    } catch (err) {
      return serverError(err)
    }
  }

  // delete
  async delete(id: string): Promise<HttpResponse> {
    try {
      // await this.repository.delete(id)
      await this.repository.update(id, { desabilitado: true })

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
      // await this.repository.delete(ids)
      await this.repository.update(ids, { desabilitado: true })

      return noContent()
    } catch (err) {
      if (err.message.slice(0, 10) === "null value") {
        throw new AppError("not null constraint", 404)
      }

      return serverError(err)
    }
  }
}

export { ProdutoRepository }
