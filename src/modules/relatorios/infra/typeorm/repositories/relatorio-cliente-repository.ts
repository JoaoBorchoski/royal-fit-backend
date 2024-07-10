import { Brackets, getRepository, Repository } from 'typeorm'
import { IRelatorioClienteDTO } from '@modules/relatorios/dtos/i-relatorio-cliente-dto'
import { IRelatorioClienteRepository } from '@modules/relatorios/repositories/i-relatorio-cliente-repository'
import { RelatorioCliente } from '@modules/relatorios/infra/typeorm/entities/relatorio-cliente'
import { noContent, serverError, ok, notFound, HttpResponse } from '@shared/helpers'
import { AppError } from '@shared/errors/app-error'

class RelatorioClienteRepository implements IRelatorioClienteRepository {
  private repository: Repository<RelatorioCliente>

  constructor() {
    this.repository = getRepository(RelatorioCliente)
  }


  // create
  async create ({
    clienteId,
    dataInicio,
    dataFim,
    relatório,
    desabilitado
  }: IRelatorioClienteDTO): Promise<HttpResponse> {
    const relatorioCliente = this.repository.create({
      clienteId,
      dataInicio,
      dataFim,
      relatório,
      desabilitado
    })

    const result = await this.repository.save(relatorioCliente)
      .then(relatorioClienteResult => {
        return ok(relatorioClienteResult)
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
      "clienteNome",
      "dataInicio",
      "dataFim",
    ]
    const columnOrder = new Array<'ASC' | 'DESC'>(2).fill('ASC')

    const index = referenceArray.indexOf(columnName)

    columnOrder[index] = columnDirection

    const offset = rowsPerPage * page

    try {
      let query = this.repository.createQueryBuilder('rel')
        .select([
          'rel.id as "id"',
          'a.id as "clienteId"',
          'a.nome as "clienteNome"',
          'rel.dataInicio as "dataInicio"',
          'rel.dataFim as "dataFim"',
        ])
        .leftJoin('rel.clienteId', 'a')

      if (filter) {
        query = query
          .where(filter)
      }

      const relatoriosClientes = await query
        .andWhere(new Brackets(query => {
          query.andWhere('CAST(a.nome AS VARCHAR) ilike :search', { search: `%${search}%` })
        }))
        .addOrderBy('a.nome', columnOrder[0])
        .addOrderBy('rel.dataInicio', columnOrder[1])
        .addOrderBy('rel.dataFim', columnOrder[2])
        .offset(offset)
        .limit(rowsPerPage)
        .take(rowsPerPage)
        .getRawMany()

      return ok(relatoriosClientes)
    } catch (err) {
      return serverError(err)
    }
  }


  // select
  async select (filter: string): Promise<HttpResponse> {
    try {
      const relatoriosClientes = await this.repository.createQueryBuilder('rel')
        .select([
          'rel. as "value"',
          'rel. as "label"',
        ])
        .where('rel. ilike :filter', { filter: `${filter}%` })
        .addOrderBy('rel.')
        .getRawMany()

      return ok(relatoriosClientes)
    } catch (err) {
      return serverError(err)
    }
  }


  // id select
  async idSelect (id: string): Promise<HttpResponse> {
    try {
      const relatorioCliente = await this.repository.createQueryBuilder('rel')
        .select([
          'rel. as "value"',
          'rel. as "label"',
        ])
        .where('rel. = :id', { id: `${id}` })
        .getRawOne()

      return ok(relatorioCliente)
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
      let query = this.repository.createQueryBuilder('rel')
        .select([
          'rel.id as "id"',
        ])
        .leftJoin('rel.clienteId', 'a')

      if (filter) {
        query = query
          .where(filter)
      }

      const relatoriosClientes = await query
        .andWhere(new Brackets(query => {
          query.andWhere('CAST(a.nome AS VARCHAR) ilike :search', { search: `%${search}%` })
        }))
        .getRawMany()

      return ok({ count: relatoriosClientes.length })
    } catch (err) {
      return serverError(err)
    }
  }


  // get
  async get (id: string): Promise<HttpResponse> {
    try {
      const relatorioCliente = await this.repository.createQueryBuilder('rel')
        .select([
          'rel.id as "id"',
          'rel.clienteId as "clienteId"',
          'a.nome as "clienteNome"',
          'rel.dataInicio as "dataInicio"',
          'rel.dataFim as "dataFim"',
          'rel.relatório as "relatório"',
          'rel.desabilitado as "desabilitado"',
        ])
        .leftJoin('rel.clienteId', 'a')
        .where('rel.id = :id', { id })
        .getRawOne()

      if (typeof relatorioCliente === 'undefined') {
        return noContent()
      }

      return ok(relatorioCliente)
    } catch (err) {
      return serverError(err)
    }
  }


  // update
  async update ({
    id,
    clienteId,
    dataInicio,
    dataFim,
    relatório,
    desabilitado
  }: IRelatorioClienteDTO): Promise<HttpResponse> {
    const relatorioCliente = await this.repository.findOne(id)

    if (!relatorioCliente) {
      return notFound()
    }

    const newrelatorioCliente = this.repository.create({
      id,
      clienteId,
      dataInicio,
      dataFim,
      relatório,
      desabilitado
    })

    try {
      await this.repository.save(newrelatorioCliente)

      return ok(newrelatorioCliente)
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

export { RelatorioClienteRepository }
