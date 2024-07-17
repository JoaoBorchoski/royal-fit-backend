import createConnection from "../index"

async function create() {
  const connection = await createConnection()

  await connection.query(
    `INSERT INTO produtos (
      id,
      nome,
      preco,
      descricao,
      created_at,
      updated_at
    ) values 
      ('fbe43047-093b-496b-9c59-ce5c2ce66b34', 'Garrafão 20L - Envase', 17, 'Garrafão 20L - Envase', 'now()', 'now()'),
      ('907a8147-dada-4532-82a7-0346666792c9', 'Garrafão 20L - Novo', 20, 'Garrafão 20L - Novo', 'now()', 'now()'),
      ('83ee8914-44d9-48be-9b9b-55057bb44787', '10L Retornavel', 10, '10L Retornavel', 'now()', 'now()'),
      ('28f4726e-db0f-4d48-88a0-64f0ec4d697b', '10L Descartavel', 12, '10L Descartavel', 'now()', 'now()'),
      ('906b4eb8-7fa7-41c3-88f1-b826048ebf31', '5L Descartável', 6, '5L Descartável', 'now()', 'now()'),
      ('4c652b29-b73d-4148-8015-5055cfdd8adc', '1500 Sem Gás', 3, '1500 Sem Gás', 'now()', 'now()'),
      ('1a1193c9-0ff4-4d1c-95b3-8a9c8bc9334b', '510 Sem Gás', 1.50, '510 Sem Gás', 'now()', 'now()'),
      ('17239db9-cbce-487f-9703-e700b5d3cc42', '500 Com Gás', 1, '500 Com Gás', 'now()', 'now()'),
      ('33367833-9fc0-4e17-af4e-a835d9edc3be', 'Caixa de Copo', 30, 'Caixa de Copo', 'now()', 'now()')`
  )

  await connection.close()
}

export async function produtos() {
  await create().then(() => console.log("Tabela de produtos criada!"))
}
