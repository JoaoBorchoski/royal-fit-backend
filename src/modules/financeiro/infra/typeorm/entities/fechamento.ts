import { PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Entity } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'


@Entity('fechamento')
class Fechamento {
  @PrimaryColumn()
  id?: string

  @Column({ name: 'data', nullable: true, type: 'timestamptz' })
  data?: Date

  @Column({ name: 'saldo_inicial', nullable: true })
  saldoInicial?: Number

  @Column({ name: 'saldo_final', nullable: true })
  saldoFinal?: Number

  @Column({ name: 'saldo_entradas', nullable: true })
  saldoEntradas?: Number

  @Column({ name: 'valor_total', nullable: true })
  valorTotal?: Number

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

export { Fechamento }
