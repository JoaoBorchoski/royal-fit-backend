import { PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'

import { Cliente } from '@modules/cadastros/infra/typeorm/entities/cliente'

@Entity('pedido_bonificado')
class PedidoBonificado {
  @PrimaryColumn()
  id?: string

  @ManyToOne(() => Cliente, { nullable: true, eager: true })
  @JoinColumn({ name: 'cliente_id', referencedColumnName: 'id' })
  clienteId?: string

  @Column({ name: 'quantidade', nullable: true })
  quantidade?: Number

  @Column({ name: 'data', nullable: true, type: 'timestamptz' })
  data?: Date

  @Column({ name: 'is_liberado', nullable: true, default: false })
  isLiberado?: boolean

  @Column({ name: 'desabilitado', nullable: true, default: false })
  desabilitado?: boolean

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt?: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date

  constructor() {
    if (!this.id) {
      this.id = uuidV4()
    }
  }
}

export { PedidoBonificado }
