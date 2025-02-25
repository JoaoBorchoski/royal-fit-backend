import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateFechamento1736173669001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'fechamento',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'data',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'saldo_inicial',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'saldo_final',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'saldo_entradas',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'valor_total',
            type: 'decimal',
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
    await queryRunner.dropTable('fechamento')
  }
}
