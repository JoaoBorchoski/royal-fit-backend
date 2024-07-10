import { PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'

import { Cliente } from '@modules/cadastros/infra/typeorm/entities/cliente'
import { StatusPagamento } from '@modules/cadastros/infra/typeorm/entities/status-pagamento'

@Entity('pagamentos')
class Pagamento {
  @PrimaryColumn()
  id?: string

  @ManyToOne(() => Cliente, { nullable: true, eager: true })
  @JoinColumn({ name: 'cliente_id', referencedColumnName: 'id' })
  clienteId?: string

  @Column({ name: 'valor_pago', nullable: true })
  valorPago?: Number

  @ManyToOne(() => StatusPagamento, { nullable: true, eager: true })
  @JoinColumn({ name: 'meio_pagamento_id', referencedColumnName: 'id' })
  meioPagamentoId?: string

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

export { Pagamento }
