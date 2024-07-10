import { IFuncionarioDTO } from '@modules/cadastros/dtos/i-funcionario-dto'
import { IFuncionarioRepository } from '@modules/cadastros/repositories/i-funcionario-repository'
import { Funcionario } from '@modules/cadastros/infra/typeorm/entities/funcionario'
import { ok, notFound, HttpResponse } from '@shared/helpers'

class FuncionarioRepositoryInMemory implements IFuncionarioRepository {
  funcionarios: Funcionario[] = []

  // create
  async create ({
    nome,
    cpf,
    email,
    cargo,
    cep,
    estadoId,
    cidadeId,
    bairro,
    endereco,
    numero,
    complemento,
    telefone,
    usuarioId,
    desabilitado
  }: IFuncionarioDTO): Promise<HttpResponse> {
    const funcionario = new Funcionario()

    Object.assign(funcionario, {
      nome,
      cpf,
      email,
      cargo,
      cep,
      estadoId,
      cidadeId,
      bairro,
      endereco,
      numero,
      complemento,
      telefone,
      usuarioId,
      desabilitado
    })

    this.funcionarios.push(funcionario)

    return ok(funcionario)
  }


  // list
  async list (
    search: string,
    page: number,
    rowsPerPage: number,
    order: string
  ): Promise<HttpResponse> {
    let filteredFuncionarios = this.funcionarios

    filteredFuncionarios = filteredFuncionarios.filter((funcionario) => {
      if (funcionario.nome.includes(search)) return true
      if (funcionario.cpf.includes(search)) return true
      if (funcionario.cargo.includes(search)) return true

      return false
    })

    return ok(filteredFuncionarios.slice((page - 1) * rowsPerPage, page * rowsPerPage))
  }


  // select
  async select (filter: string): Promise<HttpResponse> {
    let filteredFuncionarios = this.funcionarios

    filteredFuncionarios = filteredFuncionarios.filter((funcionario) => {
      if (funcionario.nome.includes(filter)) return true
      if (funcionario.cpf.includes(filter)) return true
      if (funcionario.cargo.includes(filter)) return true

      return false
    })

    return ok(filteredFuncionarios)
  }


  //
  // id select
  idSelect(id: string): Promise<HttpResponse<any>> {
    throw new Error('Method not implemented.')
  }


  // count
  async count (search: string,): Promise<HttpResponse> {
    let filteredFuncionarios = this.funcionarios

    filteredFuncionarios = filteredFuncionarios.filter((funcionario) => {
      if (funcionario.nome.includes(search)) return true
      if (funcionario.cpf.includes(search)) return true
      if (funcionario.cargo.includes(search)) return true

      return false
    })

    return ok(filteredFuncionarios.length)
  }


  // get
  async get (id: string): Promise<HttpResponse> {
    const funcionario = this.funcionarios.find((funcionario) => funcionario.id === id)

    if (typeof funcionario === 'undefined') {
      return notFound()
    } else {
      return ok(funcionario)
    }
  }


  // update
  async update ({
    id,
    nome,
    cpf,
    email,
    cargo,
    cep,
    estadoId,
    cidadeId,
    bairro,
    endereco,
    numero,
    complemento,
    telefone,
    usuarioId,
    desabilitado
  }: IFuncionarioDTO): Promise<HttpResponse> {
    const index = this.funcionarios.findIndex((funcionario) => funcionario.id === id)

    this.funcionarios[index].nome = nome
    this.funcionarios[index].cpf = cpf
    this.funcionarios[index].email = email
    this.funcionarios[index].cargo = cargo
    this.funcionarios[index].cep = cep
    this.funcionarios[index].estadoId = estadoId
    this.funcionarios[index].cidadeId = cidadeId
    this.funcionarios[index].bairro = bairro
    this.funcionarios[index].endereco = endereco
    this.funcionarios[index].numero = numero
    this.funcionarios[index].complemento = complemento
    this.funcionarios[index].telefone = telefone
    this.funcionarios[index].usuarioId = usuarioId
    this.funcionarios[index].desabilitado = desabilitado

    return ok(this.funcionarios[index])
  }


  // delete
  async delete (id: string): Promise<HttpResponse> {
    const index = this.funcionarios.findIndex((funcionario) => funcionario.id === id)

    this.funcionarios.splice(index, 1)

    return ok(this.funcionarios)
  }


  // multi delete
  multiDelete(ids: string[]): Promise<HttpResponse<any>> {
    throw new Error('Method not implemented.')
  }
}

export { FuncionarioRepositoryInMemory }
