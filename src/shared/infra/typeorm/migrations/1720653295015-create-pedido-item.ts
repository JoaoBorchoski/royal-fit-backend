import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreatePedidoItem1720653295015 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "pedido_itens",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "produto_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "pedido_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "quantidade",
            type: "int",
            isNullable: true,
          },
          {
            name: "valor_produto",
            type: "numeric",
            isNullable: true,
          },
          {
            name: "valor",
            type: "numeric",
            isNullable: true,
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
            name: "FKProdutoPedidoItemProdutoId",
            referencedTableName: "produtos",
            referencedColumnNames: ["id"],
            columnNames: ["produto_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
          {
            name: "FKPedidoPedidoItemPedidoId",
            referencedTableName: "pedidos",
            referencedColumnNames: ["id"],
            columnNames: ["pedido_id"],
            onDelete: "CASCADE",
            onUpdate: "SET NULL",
          },
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("pedido_itens")
  }
}
