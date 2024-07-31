import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateAlmoxarifadoItem1722385597001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'almoxarifado_itens',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'item',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'quantidade',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'quantidade_min',
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
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('almoxarifado_itens')
  }
}
