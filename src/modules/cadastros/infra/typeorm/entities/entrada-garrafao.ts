import { PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm"
import { v4 as uuidV4 } from "uuid"
import { Cliente } from "./cliente"

@Entity("entrada_garrafao")
class EntradaGarrafao {
  @PrimaryColumn()
  id?: string

  @ManyToOne(() => Cliente, { nullable: true, eager: true })
  @JoinColumn({ name: "cliente_id", referencedColumnName: "id" })
  clienteId?: string

  @Column({ name: "quantidade", nullable: true })
  quantidade?: Number

  @Column({ name: "is_royalfit", nullable: true, default: false })
  isRoyalfit?: boolean

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

export { EntradaGarrafao }
