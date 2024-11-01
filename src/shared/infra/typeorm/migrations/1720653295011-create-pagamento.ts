import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreatePagamento1720653295011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "pagamentos",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "cliente_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "valor_pago",
            type: "numeric",
            isNullable: true,
          },
          {
            name: "meio_pagamento_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "user_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "data",
            type: "timestamp",
            isNullable: false,
          },
          {
            name: "desabilitado",
            type: "boolean",
            default: false,
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
        foreignKeys: [
          {
            name: "FKClientePagamentoClienteId",
            referencedTableName: "clientes",
            referencedColumnNames: ["id"],
            columnNames: ["cliente_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
          {
            name: "FKMeioPagamentoPagamentoMeioPagamentoId",
            referencedTableName: "meios_pagamento",
            referencedColumnNames: ["id"],
            columnNames: ["meio_pagamento_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("pagamentos")
  }
}
