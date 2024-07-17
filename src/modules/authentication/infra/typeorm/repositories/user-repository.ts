import { EntityManager, getRepository, Repository, TransactionManager } from "typeorm"
import { IUserDTO } from "@modules/authentication/dtos/i-user-dto"
import { IUserRepository } from "@modules/authentication/repositories/i-user-repository"
import { User } from "../entities/user"

class UserRepository implements IUserRepository {
  private repository: Repository<User>

  constructor() {
    this.repository = getRepository(User)
  }

  async create({
    id,
    userGroupId,
    name,
    login,
    password,
    isAdmin,
    isSuperUser,
    isBlocked,
    blockReasonId,
    mustChangePasswordNextLogon,
    avatar,
    isDisabled,
  }: IUserDTO): Promise<User> {
    try {
      const user = this.repository.create({
        id,
        userGroupId,
        name,
        login,
        password,
        isAdmin,
        isSuperUser,
        isBlocked,
        blockReasonId,
        mustChangePasswordNextLogon,
        avatar,
        isDisabled,
      })

      const result = await this.repository.save(user)

      return result
    } catch (error) {
      return error
    }
  }

  async createWithQueryRunner(
    {
      id,
      userGroupId,
      name,
      login,
      password,
      isAdmin,
      isSuperUser,
      isBlocked,
      blockReasonId,
      mustChangePasswordNextLogon,
      avatar,
      isDisabled,
    }: IUserDTO,
    @TransactionManager() transactionManager: EntityManager
  ): Promise<User> {
    try {
      const user = transactionManager.create(User, {
        id,
        userGroupId,
        name,
        login,
        password,
        isAdmin,
        isSuperUser,
        isBlocked,
        blockReasonId,
        mustChangePasswordNextLogon,
        avatar,
        isDisabled,
      })

      const result = await transactionManager.save(user)

      return result
    } catch (error) {
      return error
    }
  }

  async findByEmail(login: string): Promise<User> {
    const newLogin = login.toLowerCase()
    const user = await this.repository.findOne({ login: newLogin })

    return user
  }

  async findByEmailWithQueryRunner(login: string, @TransactionManager() transactionManager: EntityManager): Promise<User> {
    const newLogin = login.toLowerCase()
    const user = await transactionManager.findOne(User, { login: newLogin })

    return user
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findOne(id)
    return user
  }
}

export { UserRepository }
