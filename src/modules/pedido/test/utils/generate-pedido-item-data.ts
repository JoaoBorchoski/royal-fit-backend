import { faker } from '@faker-js/faker'

export function generateNewPedidoItemData(overide = {}) {
  return {
    produtoId: null,
    pedidoId: null,
    quantidade: faker.datatype.number({ max: 9 }),
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generatePedidoItemData(overide = {}) {
  return {
    id: faker.datatype.uuid(),
    produtoId: null,
    pedidoId: null,
    quantidade: faker.datatype.number({ max: 9 }),
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generatePedidoItensData(n: number = 1, overide = {}) {
  return Array.from(
    {
      length: n,
    },
    (_, i) => {
      return generatePedidoItemData(overide)
    }
  )
}
