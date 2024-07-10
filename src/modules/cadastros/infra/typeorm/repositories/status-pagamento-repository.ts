import { Brackets, getRepository, Repository } from 'typeorm'
import { IStatusPagamentoDTO } from '@modules/cadastros/dtos/i-status-pagamento-dto'
import { IStatusPagamentoRepository } from '@modules/cadastros/repositories/i-status-pagamento-repository'
import { StatusPagamento } from '@modules/cadastros/infra/typeorm/entities/status-pagamento'
import { noContent, serverError, ok, notFound, HttpResponse } from '@shared/helpers'
import { AppError } from '@shared/errors/app-error'

class StatusPagamentoRepository implements IStatusPagamentoRepository {
  private repository: Repository<StatusPagamento>

  constructor() {
    this.repository = getRepository(StatusPagamento)
  }


  // create
  async create ({
    nome,
    descricao,
    desabilitado
  }: IStatusPagamentoDTO): Promise<HttpResponse> {
    const statusPagamento = this.repository.create({
      nome,
      descricao,
      desabilitado
    })

    const result = await this.repository.save(statusPagamento)
      .then(statusPagamentoResult => {
        return ok(statusPagamentoResult)
      })
      .catch(error => {
        return serverError(error)
      })

    return result
  }


  // list
  async list (
    search: string,
    page: number,
    rowsPerPage: number,
    order: string,
    filter: string
  ): Promise<HttpResponse> {
    let columnName: string
    let columnDirection: 'ASC' | 'DESC'

    if ((typeof(order) === 'undefined') || (order === "")) {
      columnName = 'nome'
      columnDirection = 'ASC'
    } else {
      columnName = order.substring(0, 1) === '-' ? order.substring(1) : order
      columnDirection = order.substring(0, 1) === '-' ? 'DESC' : 'ASC'
    }

    const referenceArray = [
      "nome",
      "descricao",
    ]
    const columnOrder = new Array<'ASC' | 'DESC'>(2).fill('ASC')

    const index = referenceArray.indexOf(columnName)

    columnOrder[index] = columnDirection

    const offset = rowsPerPage * page

    try {
      let query = this.repository.createQueryBuilder('sta')
        .select([
          'sta.id as "id"',
          'sta.nome as "nome"',
          'sta.descricao as "descricao"',
        ])

      if (filter) {
        query = query
          .where(filter)
      }

      const statusPagamento = await query
        .andWhere(new Brackets(query => {
          query.andWhere('CAST(sta.nome AS VARCHAR) ilike :search', { search: `%${search}%` })
          query.orWhere('CAST(sta.descricao AS VARCHAR) ilike :search', { search: `%${search}%` })
        }))
        .addOrderBy('sta.nome', columnOrder[0])
        .addOrderBy('sta.descricao', columnOrder[1])
        .offset(offset)
        .limit(rowsPerPage)
        .take(rowsPerPage)
        .getRawMany()

      return ok(statusPagamento)
    } catch (err) {
      return serverError(err)
    }
  }


  // select
  async select (filter: string): Promise<HttpResponse> {
    try {
      const statusPagamento = await this.repository.createQueryBuilder('sta')
        .select([
          'sta.id as "value"',
          'sta.nome as "label"',
        ])
        .where('sta.nome ilike :filter', { filter: `${filter}%` })
        .addOrderBy('sta.nome')
        .getRawMany()

      return ok(statusPagamento)
    } catch (err) {
      return serverError(err)
    }
  }


  // id select
  async idSelect (id: string): Promise<HttpResponse> {
    try {
      const statusPagamento = await this.repository.createQueryBuilder('sta')
        .select([
          'sta.id as "value"',
          'sta.nome as "label"',
        ])
        .where('sta.id = :id', { id: `${id}` })
        .getRawOne()

      return ok(statusPagamento)
    } catch (err) {
      return serverError(err)
    }
  }


  // count
  async count (
    search: string,
    filter: string
  ): Promise<HttpResponse> {
    try {
      let query = this.repository.createQueryBuilder('sta')
        .select([
          'sta.id as "id"',
        ])

      if (filter) {
        query = query
          .where(filter)
      }

      const statusPagamento = await query
        .andWhere(new Brackets(query => {
          query.andWhere('CAST(sta.nome AS VARCHAR) ilike :search', { search: `%${search}%` })
          query.orWhere('CAST(sta.descricao AS VARCHAR) ilike :search', { search: `%${search}%` })
        }))
        .getRawMany()

      return ok({ count: statusPagamento.length })
    } catch (err) {
      return serverError(err)
    }
  }


  // get
  async get (id: string): Promise<HttpResponse> {
    try {
      const statusPagamento = await this.repository.createQueryBuilder('sta')
        .select([
          'sta.id as "id"',
          'sta.nome as "nome"',
          'sta.descricao as "descricao"',
          'sta.desabilitado as "desabilitado"',
        ])
        .where('sta.id = :id', { id })
        .getRawOne()

      if (typeof statusPagamento === 'undefined') {
        return noContent()
      }

      return ok(statusPagamento)
    } catch (err) {
      return serverError(err)
    }
  }


  // update
  async update ({
    id,
    nome,
    descricao,
    desabilitado
  }: IStatusPagamentoDTO): Promise<HttpResponse> {
    const statusPagamento = await this.repository.findOne(id)

    if (!statusPagamento) {
      return notFound()
    }

    const newstatusPagamento = this.repository.create({
      id,
      nome,
      descricao,
      desabilitado
    })

    try {
      await this.repository.save(newstatusPagamento)

      return ok(newstatusPagamento)
    } catch (err) {
      return serverError(err)
    }
  }


  // delete
  async delete (id: string): Promise<HttpResponse> {
    try {
      await this.repository.delete(id)

      return noContent()
    } catch (err) {
      if(err.message.slice(0, 10) === 'null value') {
        throw new AppError('not null constraint', 404)
      }

      return serverError(err)
    }
  }


  // multi delete
  async multiDelete (ids: string[]): Promise<HttpResponse> {
    try {
      await this.repository.delete(ids)

      return noContent()
    } catch (err) {
      if(err.message.slice(0, 10) === 'null value') {
        throw new AppError('not null constraint', 404)
      }

      return serverError(err)
    }
  }
}

export { StatusPagamentoRepository }
