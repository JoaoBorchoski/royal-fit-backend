import { PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm"
import { v4 as uuidV4 } from "uuid"

import { Estado } from "@modules/comum/infra/typeorm/entities/estado"
import { Cidade } from "@modules/comum/infra/typeorm/entities/cidade"

@Entity("clientes")
class Cliente {
  @PrimaryColumn()
  id?: string

  @Column({ name: "nome", nullable: true })
  nome?: string

  @Column({ name: "cpf_cnpj", nullable: true })
  cpfCnpj?: string

  @Column({ name: "email", nullable: true })
  email?: string

  @Column({ name: "is_bonificado", nullable: true })
  isBonificado?: boolean

  @Column({ name: "desconto", nullable: true })
  desconto?: Number

  @Column({ name: "cep", nullable: true })
  cep?: string

  @ManyToOne(() => Estado, { nullable: true, eager: true })
  @JoinColumn({ name: "estado_id", referencedColumnName: "id" })
  estadoId?: string

  @ManyToOne(() => Cidade, { nullable: true, eager: true })
  @JoinColumn({ name: "cidade_id", referencedColumnName: "id" })
  cidadeId?: string

  @Column({ name: "bairro", nullable: true })
  bairro?: string

  @Column({ name: "endereco", nullable: true })
  endereco?: string

  @Column({ name: "numero", nullable: true })
  numero?: Number

  @Column({ name: "complemento", nullable: true })
  complemento?: string

  @Column({ name: "telefone", nullable: true })
  telefone?: string

  @Column({ name: "usuario_id", nullable: true })
  usuarioId?: string

  @Column({ name: "desabilitado", nullable: true, default: false })
  desabilitado?: boolean

  @CreateDateColumn({ name: "created_at", nullable: true })
  createdAt?: Date

  @UpdateDateColumn({ name: "updated_at", nullable: true })
  updatedAt?: Date

  constructor() {
    if (!this.id) {
      this.id = uuidV4()
    }
  }
}

export { Cliente }
