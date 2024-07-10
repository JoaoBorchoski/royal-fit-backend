import { Brackets, getRepository, Repository } from 'typeorm'
import { IMeioPagamentoDTO } from '@modules/cadastros/dtos/i-meio-pagamento-dto'
import { IMeioPagamentoRepository } from '@modules/cadastros/repositories/i-meio-pagamento-repository'
import { MeioPagamento } from '@modules/cadastros/infra/typeorm/entities/meio-pagamento'
import { noContent, serverError, ok, notFound, HttpResponse } from '@shared/helpers'
import { AppError } from '@shared/errors/app-error'

class MeioPagamentoRepository implements IMeioPagamentoRepository {
  private repository: Repository<MeioPagamento>

  constructor() {
    this.repository = getRepository(MeioPagamento)
  }


  // create
  async create ({
    nome,
    descricao,
    desabilitado
  }: IMeioPagamentoDTO): Promise<HttpResponse> {
    const meioPagamento = this.repository.create({
      nome,
      descricao,
      desabilitado
    })

    const result = await this.repository.save(meioPagamento)
      .then(meioPagamentoResult => {
        return ok(meioPagamentoResult)
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
      let query = this.repository.createQueryBuilder('mei')
        .select([
          'mei.id as "id"',
          'mei.nome as "nome"',
          'mei.descricao as "descricao"',
        ])

      if (filter) {
        query = query
          .where(filter)
      }

      const meiosPagamento = await query
        .andWhere(new Brackets(query => {
          query.andWhere('CAST(mei.nome AS VARCHAR) ilike :search', { search: `%${search}%` })
          query.orWhere('CAST(mei.descricao AS VARCHAR) ilike :search', { search: `%${search}%` })
        }))
        .addOrderBy('mei.nome', columnOrder[0])
        .addOrderBy('mei.descricao', columnOrder[1])
        .offset(offset)
        .limit(rowsPerPage)
        .take(rowsPerPage)
        .getRawMany()

      return ok(meiosPagamento)
    } catch (err) {
      return serverError(err)
    }
  }


  // select
  async select (filter: string): Promise<HttpResponse> {
    try {
      const meiosPagamento = await this.repository.createQueryBuilder('mei')
        .select([
          'mei. as "value"',
          'mei. as "label"',
        ])
        .where('mei. ilike :filter', { filter: `${filter}%` })
        .addOrderBy('mei.')
        .getRawMany()

      return ok(meiosPagamento)
    } catch (err) {
      return serverError(err)
    }
  }


  // id select
  async idSelect (id: string): Promise<HttpResponse> {
    try {
      const meioPagamento = await this.repository.createQueryBuilder('mei')
        .select([
          'mei. as "value"',
          'mei. as "label"',
        ])
        .where('mei. = :id', { id: `${id}` })
        .getRawOne()

      return ok(meioPagamento)
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
      let query = this.repository.createQueryBuilder('mei')
        .select([
          'mei.id as "id"',
        ])

      if (filter) {
        query = query
          .where(filter)
      }

      const meiosPagamento = await query
        .andWhere(new Brackets(query => {
          query.andWhere('CAST(mei.nome AS VARCHAR) ilike :search', { search: `%${search}%` })
          query.orWhere('CAST(mei.descricao AS VARCHAR) ilike :search', { search: `%${search}%` })
        }))
        .getRawMany()

      return ok({ count: meiosPagamento.length })
    } catch (err) {
      return serverError(err)
    }
  }


  // get
  async get (id: string): Promise<HttpResponse> {
    try {
      const meioPagamento = await this.repository.createQueryBuilder('mei')
        .select([
          'mei.id as "id"',
          'mei.nome as "nome"',
          'mei.descricao as "descricao"',
          'mei.desabilitado as "desabilitado"',
        ])
        .where('mei.id = :id', { id })
        .getRawOne()

      if (typeof meioPagamento === 'undefined') {
        return noContent()
      }

      return ok(meioPagamento)
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
  }: IMeioPagamentoDTO): Promise<HttpResponse> {
    const meioPagamento = await this.repository.findOne(id)

    if (!meioPagamento) {
      return notFound()
    }

    const newmeioPagamento = this.repository.create({
      id,
      nome,
      descricao,
      desabilitado
    })

    try {
      await this.repository.save(newmeioPagamento)

      return ok(newmeioPagamento)
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

export { MeioPagamentoRepository }
