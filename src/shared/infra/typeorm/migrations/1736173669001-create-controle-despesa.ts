import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateControleDespesa1736173669001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "controle_despesas",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "data_emissao",
            type: "date",
            isNullable: false,
          },
          {
            name: "data_vencimento",
            type: "date",
            isNullable: false,
          },
          {
            name: "descricao",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "valor",
            type: "decimal",
            isNullable: true,
          },
          {
            name: "status",
            type: "decimal",
            isNullable: true,
          },
          {
            name: "categoria",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "codigo_barras",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "pedido_id",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "cliente_id",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "forma_pagamento_id",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("controle_despesas")
  }
}
