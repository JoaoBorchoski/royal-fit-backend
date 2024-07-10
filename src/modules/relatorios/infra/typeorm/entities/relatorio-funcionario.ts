import { PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'

import { Funcionario } from '@modules/cadastros/infra/typeorm/entities/funcionario'

@Entity('relatorios_funcionarios')
class RelatorioFuncionario {
  @PrimaryColumn()
  id?: string

  @ManyToOne(() => Funcionario, { nullable: true, eager: true })
  @JoinColumn({ name: 'funcionario_id', referencedColumnName: 'id' })
  funcionarioId?: string

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

export { RelatorioFuncionario }
