import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateEstoque1720982959018 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'estoques',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'produto_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'quantidade',
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
            name: 'FKProdutoEstoqueProdutoId',
            referencedTableName: 'produtos',
            referencedColumnNames: ['id'],
            columnNames: ['produto_id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL',
          }
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('estoques')
  }
}
