import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateCaixa1736173669001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'caixa',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'descricao',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'valor',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'data',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'pedido_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cliente_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'forma_pagamento_id',
            type: 'varchar',
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
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('caixa')
  }
}
