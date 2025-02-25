import { PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Entity } from "typeorm"
import { v4 as uuidV4 } from "uuid"

@Entity("controle_despesas")
class ControleDespesa {
  @PrimaryColumn()
  id?: string

  @Column({ name: "data_emissao", nullable: true, type: "timestamptz" })
  dataEmissao?: Date

  @Column({ name: "data_vencimento", nullable: true, type: "timestamptz" })
  dataVencimento?: Date

  @Column({ name: "descricao", nullable: true })
  descricao?: string

  @Column({ name: "valor", nullable: true })
  valor?: Number

  @Column({ name: "status", nullable: true })
  status?: Number

  @Column({ name: "categoria", nullable: true })
  categoria?: string

  @Column({ name: "codigo_barras", nullable: true })
  codigoBarras?: string

  @Column({ name: "pedido_id", nullable: true })
  pedidoId?: string

  @Column({ name: "cliente_id", nullable: true })
  clienteId?: string

  @Column({ name: "forma_pagamento_id", nullable: true })
  formaPagamentoId?: string

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

export { ControleDespesa }
