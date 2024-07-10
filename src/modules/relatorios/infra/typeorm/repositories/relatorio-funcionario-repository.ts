import { Brackets, getRepository, Repository } from 'typeorm'
import { IRelatorioFuncionarioDTO } from '@modules/relatorios/dtos/i-relatorio-funcionario-dto'
import { IRelatorioFuncionarioRepository } from '@modules/relatorios/repositories/i-relatorio-funcionario-repository'
import { RelatorioFuncionario } from '@modules/relatorios/infra/typeorm/entities/relatorio-funcionario'
import { noContent, serverError, ok, notFound, HttpResponse } from '@shared/helpers'
import { AppError } from '@shared/errors/app-error'

class RelatorioFuncionarioRepository implements IRelatorioFuncionarioRepository {
  private repository: Repository<RelatorioFuncionario>

  constructor() {
    this.repository = getRepository(RelatorioFuncionario)
  }


  // create
  async create ({
    funcionarioId,
    dataInicio,
    dataFim,
    relatório,
    desabilitado
  }: IRelatorioFuncionarioDTO): Promise<HttpResponse> {
    const relatorioFuncionario = this.repository.create({
      funcionarioId,
      dataInicio,
      dataFim,
      relatório,
      desabilitado
    })

    const result = await this.repository.save(relatorioFuncionario)
      .then(relatorioFuncionarioResult => {
        return ok(relatorioFuncionarioResult)
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
      "funcionarioNome",
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
          'a.id as "funcionarioId"',
          'a.nome as "funcionarioNome"',
          'rel.dataInicio as "dataInicio"',
          'rel.dataFim as "dataFim"',
        ])
        .leftJoin('rel.funcionarioId', 'a')

      if (filter) {
        query = query
          .where(filter)
      }

      const relatoriosFuncionarios = await query
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

      return ok(relatoriosFuncionarios)
    } catch (err) {
      return serverError(err)
    }
  }


  // select
  async select (filter: string): Promise<HttpResponse> {
    try {
      const relatoriosFuncionarios = await this.repository.createQueryBuilder('rel')
        .select([
          'rel. as "value"',
          'rel. as "label"',
        ])
        .where('rel. ilike :filter', { filter: `${filter}%` })
        .addOrderBy('rel.')
        .getRawMany()

      return ok(relatoriosFuncionarios)
    } catch (err) {
      return serverError(err)
    }
  }


  // id select
  async idSelect (id: string): Promise<HttpResponse> {
    try {
      const relatorioFuncionario = await this.repository.createQueryBuilder('rel')
        .select([
          'rel. as "value"',
          'rel. as "label"',
        ])
        .where('rel. = :id', { id: `${id}` })
        .getRawOne()

      return ok(relatorioFuncionario)
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
        .leftJoin('rel.funcionarioId', 'a')

      if (filter) {
        query = query
          .where(filter)
      }

      const relatoriosFuncionarios = await query
        .andWhere(new Brackets(query => {
          query.andWhere('CAST(a.nome AS VARCHAR) ilike :search', { search: `%${search}%` })
        }))
        .getRawMany()

      return ok({ count: relatoriosFuncionarios.length })
    } catch (err) {
      return serverError(err)
    }
  }


  // get
  async get (id: string): Promise<HttpResponse> {
    try {
      const relatorioFuncionario = await this.repository.createQueryBuilder('rel')
        .select([
          'rel.id as "id"',
          'rel.funcionarioId as "funcionarioId"',
          'a.nome as "funcionarioNome"',
          'rel.dataInicio as "dataInicio"',
          'rel.dataFim as "dataFim"',
          'rel.relatório as "relatório"',
          'rel.desabilitado as "desabilitado"',
        ])
        .leftJoin('rel.funcionarioId', 'a')
        .where('rel.id = :id', { id })
        .getRawOne()

      if (typeof relatorioFuncionario === 'undefined') {
        return noContent()
      }

      return ok(relatorioFuncionario)
    } catch (err) {
      return serverError(err)
    }
  }


  // update
  async update ({
    id,
    funcionarioId,
    dataInicio,
    dataFim,
    relatório,
    desabilitado
  }: IRelatorioFuncionarioDTO): Promise<HttpResponse> {
    const relatorioFuncionario = await this.repository.findOne(id)

    if (!relatorioFuncionario) {
      return notFound()
    }

    const newrelatorioFuncionario = this.repository.create({
      id,
      funcionarioId,
      dataInicio,
      dataFim,
      relatório,
      desabilitado
    })

    try {
      await this.repository.save(newrelatorioFuncionario)

      return ok(newrelatorioFuncionario)
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

export { RelatorioFuncionarioRepository }
