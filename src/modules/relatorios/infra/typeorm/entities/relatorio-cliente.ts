import { PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'

import { Cliente } from '@modules/cadastros/infra/typeorm/entities/cliente'

@Entity('relatorios_clientes')
class RelatorioCliente {
  @PrimaryColumn()
  id?: string

  @ManyToOne(() => Cliente, { nullable: true, eager: true })
  @JoinColumn({ name: 'cliente_id', referencedColumnName: 'id' })
  clienteId?: string

  @Column({ name: 'data_inicio', nullable: true, type: 'timestamptz' })
  dataInicio?: Date

  @Column({ name: 'data_fim', nullable: true, type: 'timestamptz' })
  dataFim?: Date

  @Column({ name: 'relatório', nullable: true })
  relatório?: string

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

export { RelatorioCliente }
