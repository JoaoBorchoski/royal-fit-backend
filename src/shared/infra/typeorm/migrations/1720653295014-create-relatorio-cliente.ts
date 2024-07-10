import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateRelatorioCliente1720653295014 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'relatorios_clientes',
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
            name: 'data_inicio',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'data_fim',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'relatório',
            type: 'varchar',
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
            name: 'FKClienteRelatorioClienteClienteId',
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
    await queryRunner.dropTable('relatorios_clientes')
  }
}
