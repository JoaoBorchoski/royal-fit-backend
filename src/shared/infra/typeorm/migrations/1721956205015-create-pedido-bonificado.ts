import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreatePedidoBonificado1721956205015 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pedido_bonificado',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'cliente_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'quantidade',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'data',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'is_liberado',
            type: 'boolean',
            default: false,
            isNullable: true,
          },
          {
            name: 'desabilitado',
            type: 'boolean',
            default: false,
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()'
          }
        ],
        foreignKeys: [
          {
            name: 'FKClientePedidoBonificadoClienteId',
            referencedTableName: 'clientes',
            referencedColumnNames: ['id'],
            columnNames: ['cliente_id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL',
          }
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pedido_bonificado')
  }
}
