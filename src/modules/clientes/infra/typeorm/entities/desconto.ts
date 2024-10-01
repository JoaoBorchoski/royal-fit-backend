import { PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'

import { Cliente } from '@modules/cadastros/infra/typeorm/entities/cliente'
import { Produto } from '@modules/cadastros/infra/typeorm/entities/produto'

@Entity('descontos')
class Desconto {
  @PrimaryColumn()
  id?: string

  @ManyToOne(() => Cliente, { nullable: true, eager: true })
  @JoinColumn({ name: 'cliente_id', referencedColumnName: 'id' })
  clienteId?: string

  @ManyToOne(() => Produto, { nullable: true, eager: true })
  @JoinColumn({ name: 'produto_id', referencedColumnName: 'id' })
  produtoId?: string

  @Column({ name: 'desconto', nullable: true })
  desconto?: Number

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

export { Desconto }
