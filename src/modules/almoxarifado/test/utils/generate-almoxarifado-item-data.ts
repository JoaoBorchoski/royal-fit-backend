import { faker } from '@faker-js/faker'

export function generateNewAlmoxarifadoItemData(overide = {}) {
  return {
    item: faker.datatype.string(250),
    quantidade: faker.datatype.number({ max: 9 }),
    quantidadeMin: faker.datatype.number({ max: 9 }),
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generateAlmoxarifadoItemData(overide = {}) {
  return {
    id: faker.datatype.uuid(),
    item: faker.datatype.string(250),
    quantidade: faker.datatype.number({ max: 9 }),
    quantidadeMin: faker.datatype.number({ max: 9 }),
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generateAlmoxarifadoItensData(n: number = 1, overide = {}) {
  return Array.from(
    {
      length: n,
    },
    (_, i) => {
      return generateAlmoxarifadoItemData(overide)
    }
  )
}
