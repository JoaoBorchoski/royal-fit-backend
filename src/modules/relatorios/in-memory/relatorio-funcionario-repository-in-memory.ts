import { IRelatorioFuncionarioDTO } from '@modules/relatorios/dtos/i-relatorio-funcionario-dto'
import { IRelatorioFuncionarioRepository } from '@modules/relatorios/repositories/i-relatorio-funcionario-repository'
import { RelatorioFuncionario } from '@modules/relatorios/infra/typeorm/entities/relatorio-funcionario'
import { ok, notFound, HttpResponse } from '@shared/helpers'

class RelatorioFuncionarioRepositoryInMemory implements IRelatorioFuncionarioRepository {
  relatoriosFuncionarios: RelatorioFuncionario[] = []

  // create
  async create ({
    funcionarioId,
    dataInicio,
    dataFim,
    relatório,
    desabilitado
  }: IRelatorioFuncionarioDTO): Promise<HttpResponse> {
    const relatorioFuncionario = new RelatorioFuncionario()

    Object.assign(relatorioFuncionario, {
      funcionarioId,
      dataInicio,
      dataFim,
      relatório,
      desabilitado
    })

    this.relatoriosFuncionarios.push(relatorioFuncionario)

    return ok(relatorioFuncionario)
  }


  // list
  async list (
    search: string,
    page: number,
    rowsPerPage: number,
    order: string
  ): Promise<HttpResponse> {
    let filteredRelatoriosFuncionarios = this.relatoriosFuncionarios

    filteredRelatoriosFuncionarios = filteredRelatoriosFuncionarios.filter((relatorioFuncionario) => {

      return false
    })

    return ok(filteredRelatoriosFuncionarios.slice((page - 1) * rowsPerPage, page * rowsPerPage))
  }


  // select
  async select (filter: string): Promise<HttpResponse> {
    let filteredRelatoriosFuncionarios = this.relatoriosFuncionarios

    filteredRelatoriosFuncionarios = filteredRelatoriosFuncionarios.filter((relatorioFuncionario) => {

      return false
    })

    return ok(filteredRelatoriosFuncionarios)
  }


  //
  // id select
  idSelect(id: string): Promise<HttpResponse<any>> {
    throw new Error('Method not implemented.')
  }


  // count
  async count (search: string,): Promise<HttpResponse> {
    let filteredRelatoriosFuncionarios = this.relatoriosFuncionarios

    filteredRelatoriosFuncionarios = filteredRelatoriosFuncionarios.filter((relatorioFuncionario) => {

      return false
    })

    return ok(filteredRelatoriosFuncionarios.length)
  }


  // get
  async get (id: string): Promise<HttpResponse> {
    const relatorioFuncionario = this.relatoriosFuncionarios.find((relatorioFuncionario) => relatorioFuncionario.id === id)

    if (typeof relatorioFuncionario === 'undefined') {
      return notFound()
    } else {
      return ok(relatorioFuncionario)
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
    const index = this.relatoriosFuncionarios.findIndex((relatorioFuncionario) => relatorioFuncionario.id === id)

    this.relatoriosFuncionarios[index].funcionarioId = funcionarioId
    this.relatoriosFuncionarios[index].dataInicio = dataInicio
    this.relatoriosFuncionarios[index].dataFim = dataFim
    this.relatoriosFuncionarios[index].relatório = relatório
    this.relatoriosFuncionarios[index].desabilitado = desabilitado

    return ok(this.relatoriosFuncionarios[index])
  }


  // delete
  async delete (id: string): Promise<HttpResponse> {
    const index = this.relatoriosFuncionarios.findIndex((relatorioFuncionario) => relatorioFuncionario.id === id)

    this.relatoriosFuncionarios.splice(index, 1)

    return ok(this.relatoriosFuncionarios)
  }


  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse<any>> {
    throw new Error('Method not implemented.')
  }
}

export { RelatorioFuncionarioRepositoryInMemory }
