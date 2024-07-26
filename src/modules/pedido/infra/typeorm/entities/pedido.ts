import { PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm"
import { v4 as uuidV4 } from "uuid"

import { Cliente } from "@modules/cadastros/infra/typeorm/entities/cliente"
import { Funcionario } from "@modules/cadastros/infra/typeorm/entities/funcionario"
import { StatusPagamento } from "@modules/cadastros/infra/typeorm/entities/status-pagamento"
import { MeioPagamento } from "@modules/cadastros/infra/typeorm/entities/meio-pagamento"

@Entity("pedidos")
class Pedido {
  @PrimaryColumn()
  id?: string

  @Column({ name: "sequencial", nullable: true })
  sequencial?: Number

  @ManyToOne(() => Cliente, { nullable: true, eager: true })
  @JoinColumn({ name: "cliente_id", referencedColumnName: "id" })
  clienteId?: string

  @Column({ name: "data", nullable: true, type: "timestamptz" })
  data?: Date

  @Column({ name: "hora", nullable: true })
  hora?: string

  @Column({ name: "valor_total", nullable: true })
  valorTotal?: Number

  @Column({ name: "descricao", nullable: true })
  descricao?: string

  @Column({ name: "desconto", nullable: true })
  desconto?: Number

  @ManyToOne(() => Funcionario, { nullable: true, eager: true })
  @JoinColumn({ name: "funcionario_id", referencedColumnName: "id" })
  funcionarioId?: string

  @ManyToOne(() => MeioPagamento, { nullable: true, eager: true })
  @JoinColumn({ name: "meio_pagamento_id", referencedColumnName: "id" })
  meioPagamentoId?: string

  @ManyToOne(() => StatusPagamento, { nullable: true, eager: true })
  @JoinColumn({ name: "status_pagamento_id", referencedColumnName: "id" })
  statusPagamentoId?: string

  @Column({ name: "is_pagamento_posterior", nullable: true, default: false })
  isPagamentoPosterior?: boolean

  @Column({ name: "is_liberado", nullable: true, default: false })
  isLiberado?: boolean

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

export { Pedido }
