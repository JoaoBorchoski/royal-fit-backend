import { PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Entity } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'


@Entity('almoxarifado_itens')
class AlmoxarifadoItem {
  @PrimaryColumn()
  id?: string

  @Column({ name: 'item', nullable: true })
  item?: string

  @Column({ name: 'quantidade', nullable: true })
  quantidade?: Number

  @Column({ name: 'quantidade_min', nullable: true })
  quantidadeMin?: Number

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

export { AlmoxarifadoItem }
