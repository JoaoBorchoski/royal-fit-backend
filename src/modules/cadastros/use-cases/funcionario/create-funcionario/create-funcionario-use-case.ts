import { inject, injectable } from "tsyringe"
import { Funcionario } from "@modules/cadastros/infra/typeorm/entities/funcionario"
import { IFuncionarioRepository } from "@modules/cadastros/repositories/i-funcionario-repository"
import { AppError } from "@shared/errors/app-error"
import { IUserRepository } from "@modules/authentication/repositories/i-user-repository"
import { IUserGroupRepository } from "@modules/security/repositories/i-user-group-repository"
import { hash } from "bcrypt"
import { IUserProfileRepository } from "@modules/security/repositories/i-user-profile-repository"
import { HttpResponse } from "@shared/helpers"

interface IRequest {
  nome: string
  cpf: string
  email: string
  cargo: string
  cep: string
  estadoId: string
  cidadeId: string
  bairro: string
  endereco: string
  numero: number
  complemento: string
  telefone: string
  usuarioId: string
  desabilitado: boolean
}

@injectable()
class CreateFuncionarioUseCase {
  constructor(
    @inject("FuncionarioRepository")
    private funcionarioRepository: IFuncionarioRepository,
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("UserGroupRepository")
    private userGroupRepository: IUserGroupRepository,
    @inject("UserProfileRepository")
    private userProfileRepository: IUserProfileRepository
  ) {}

  async execute({
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
    desabilitado,
  }: IRequest): Promise<HttpResponse> {
    try {
      const validFuncionario = await this.funcionarioRepository.getFuncionarioByEmail(email)
      if (validFuncionario.data) {
        throw new AppError("Já existe um cliente com este email e/ou CNPJ")
      }

      const userGroupId = await this.userGroupRepository.getByName("royalfit")
      const passwordBtoa = btoa(cpf)
      const passwordHash = await hash(passwordBtoa, 8)

      const resultCreateUser = await this.userRepository.create({
        userGroupId: userGroupId.data.id,
        name: nome,
        login: email,
        password: passwordHash,
        isAdmin: false,
        isSuperUser: false,
        isBlocked: false,
        blockReasonId: null,
        mustChangePasswordNextLogon: true,
        avatar: null,
        isDisabled: false,
      })

      await this.userProfileRepository.create({
        userId: resultCreateUser.id,
        profileId: "50e82f3b-779d-4918-8076-e8bce6b738c6",
      })

      const result = await this.funcionarioRepository
        .create({
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
          usuarioId: resultCreateUser.id,
          desabilitado,
        })
        .then((funcionarioResult) => {
          return funcionarioResult
        })
        .catch((error) => {
          return error
        })

      return result
    } catch (error) {
      console.log(error)
      return error
    }
  }
}

export { CreateFuncionarioUseCase }
