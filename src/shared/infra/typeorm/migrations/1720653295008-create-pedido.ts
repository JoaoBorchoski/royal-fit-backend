import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreatePedido1720653295008 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pedidos',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'sequencial',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'cliente_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'data',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'hora',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'valor_total',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'desconto',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'funcionario_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'meio_pagamento_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'status_pagamento_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'is_pagamento_posterior',
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
            name: 'FKClientePedidoClienteId',
            referencedTableName: 'clientes',
            referencedColumnNames: ['id'],
            columnNames: ['cliente_id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL',
          },
          {
            name: 'FKFuncionarioPedidoFuncionarioId',
            referencedTableName: 'funcionarios',
            referencedColumnNames: ['id'],
            columnNames: ['funcionario_id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL',
          },
          {
            name: 'FKStatusPagamentoPedidoMeioPagamentoId',
            referencedTableName: 'status_pagamento',
            referencedColumnNames: ['id'],
            columnNames: ['meio_pagamento_id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL',
          },
          {
            name: 'FKFuncionarioPedidoStatusPagamentoId',
            referencedTableName: 'funcionarios',
            referencedColumnNames: ['id'],
            columnNames: ['status_pagamento_id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL',
          }
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pedidos')
  }
}
