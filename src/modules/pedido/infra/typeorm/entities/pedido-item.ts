import { PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'

import { Produto } from '@modules/cadastros/infra/typeorm/entities/produto'
import { Pedido } from '@modules/pedido/infra/typeorm/entities/pedido'

@Entity('pedido_itens')
class PedidoItem {
  @PrimaryColumn()
  id?: string

  @ManyToOne(() => Produto, { nullable: true, eager: true })
  @JoinColumn({ name: 'produto_id', referencedColumnName: 'id' })
  produtoId?: string

  @ManyToOne(() => Pedido, { nullable: true, eager: true })
  @JoinColumn({ name: 'pedido_id', referencedColumnName: 'id' })
  pedidoId?: string

  @Column({ name: 'quantidade', nullable: true })
  quantidade?: Number

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

export { PedidoItem }
