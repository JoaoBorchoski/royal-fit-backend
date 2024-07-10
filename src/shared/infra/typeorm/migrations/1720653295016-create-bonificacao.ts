import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateBonificacao1720653295016 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bonificacoes',
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
            name: 'total_vendido',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'bonificacao_disponivel',
            type: 'int',
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
            name: 'FKClienteBonificacaoClienteId',
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
    await queryRunner.dropTable('bonificacoes')
  }
}
