import { Brackets, getRepository, Repository } from 'typeorm'
import { IAlmoxarifadoItemDTO } from '@modules/almoxarifado/dtos/i-almoxarifado-item-dto'
import { IAlmoxarifadoItemRepository } from '@modules/almoxarifado/repositories/i-almoxarifado-item-repository'
import { AlmoxarifadoItem } from '@modules/almoxarifado/infra/typeorm/entities/almoxarifado-item'
import { noContent, serverError, ok, notFound, HttpResponse } from '@shared/helpers'
import { AppError } from '@shared/errors/app-error'

class AlmoxarifadoItemRepository implements IAlmoxarifadoItemRepository {
  private repository: Repository<AlmoxarifadoItem>

  constructor() {
    this.repository = getRepository(AlmoxarifadoItem)
  }


  // create
  async create ({
    item,
    quantidade,
    quantidadeMin,
    desabilitado
  }: IAlmoxarifadoItemDTO): Promise<HttpResponse> {
    const almoxarifadoItem = this.repository.create({
      item,
      quantidade,
      quantidadeMin,
      desabilitado
    })

    const result = await this.repository.save(almoxarifadoItem)
      .then(almoxarifadoItemResult => {
        return ok(almoxarifadoItemResult)
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
      "item",
      "quantidade",
    ]
    const columnOrder = new Array<'ASC' | 'DESC'>(2).fill('ASC')

    const index = referenceArray.indexOf(columnName)

    columnOrder[index] = columnDirection

    const offset = rowsPerPage * page

    try {
      let query = this.repository.createQueryBuilder('alm')
        .select([
          'alm.id as "id"',
          'alm.item as "item"',
          'alm.quantidade as "quantidade"',
        ])

      if (filter) {
        query = query
          .where(filter)
      }

      const almoxarifadoItens = await query
        .andWhere(new Brackets(query => {
          query.andWhere('CAST(alm.item AS VARCHAR) ilike :search', { search: `%${search}%` })
        }))
        .addOrderBy('alm.item', columnOrder[0])
        .addOrderBy('alm.quantidade', columnOrder[1])
        .offset(offset)
        .limit(rowsPerPage)
        .take(rowsPerPage)
        .getRawMany()

      return ok(almoxarifadoItens)
    } catch (err) {
      return serverError(err)
    }
  }


  // select
  async select (filter: string): Promise<HttpResponse> {
    try {
      const almoxarifadoItens = await this.repository.createQueryBuilder('alm')
        .select([
          'alm. as "value"',
          'alm. as "label"',
        ])
        .where('alm. ilike :filter', { filter: `${filter}%` })
        .addOrderBy('alm.')
        .getRawMany()

      return ok(almoxarifadoItens)
    } catch (err) {
      return serverError(err)
    }
  }


  // id select
  async idSelect (id: string): Promise<HttpResponse> {
    try {
      const almoxarifadoItem = await this.repository.createQueryBuilder('alm')
        .select([
          'alm. as "value"',
          'alm. as "label"',
        ])
        .where('alm. = :id', { id: `${id}` })
        .getRawOne()

      return ok(almoxarifadoItem)
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
      let query = this.repository.createQueryBuilder('alm')
        .select([
          'alm.id as "id"',
        ])

      if (filter) {
        query = query
          .where(filter)
      }

      const almoxarifadoItens = await query
        .andWhere(new Brackets(query => {
          query.andWhere('CAST(alm.item AS VARCHAR) ilike :search', { search: `%${search}%` })
        }))
        .getRawMany()

      return ok({ count: almoxarifadoItens.length })
    } catch (err) {
      return serverError(err)
    }
  }


  // get
  async get (id: string): Promise<HttpResponse> {
    try {
      const almoxarifadoItem = await this.repository.createQueryBuilder('alm')
        .select([
          'alm.id as "id"',
          'alm.item as "item"',
          'alm.quantidade as "quantidade"',
          'alm.quantidadeMin as "quantidadeMin"',
          'alm.desabilitado as "desabilitado"',
        ])
        .where('alm.id = :id', { id })
        .getRawOne()

      if (typeof almoxarifadoItem === 'undefined') {
        return noContent()
      }

      return ok(almoxarifadoItem)
    } catch (err) {
      return serverError(err)
    }
  }


  // update
  async update ({
    id,
    item,
    quantidade,
    quantidadeMin,
    desabilitado
  }: IAlmoxarifadoItemDTO): Promise<HttpResponse> {
    const almoxarifadoItem = await this.repository.findOne(id)

    if (!almoxarifadoItem) {
      return notFound()
    }

    const newalmoxarifadoItem = this.repository.create({
      id,
      item,
      quantidade,
      quantidadeMin,
      desabilitado
    })

    try {
      await this.repository.save(newalmoxarifadoItem)

      return ok(newalmoxarifadoItem)
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

export { AlmoxarifadoItemRepository }
