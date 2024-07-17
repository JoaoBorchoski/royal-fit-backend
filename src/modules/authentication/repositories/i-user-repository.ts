import { EntityManager } from "typeorm"
import { IUserDTO } from "../dtos/i-user-dto"
import { User } from "../infra/typeorm/entities/user"

interface IUserRepository {
  create(data: IUserDTO): Promise<User>
  findByEmail(login: string): Promise<User>
  findById(id: string): Promise<User>

  createWithQueryRunner(
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
    transactionManager: EntityManager
  ): Promise<User>

  findByEmailWithQueryRunner(login: string, transactionManager: EntityManager): Promise<User>
}

export { IUserRepository }
