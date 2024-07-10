import { faker } from '@faker-js/faker'

export function generateNewGarrafaoData(overide = {}) {
  return {
    clienteId: null,
    quantidade: faker.datatype.number({ max: 9 }),
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generateGarrafaoData(overide = {}) {
  return {
    id: faker.datatype.uuid(),
    clienteId: null,
    quantidade: faker.datatype.number({ max: 9 }),
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generateGarrafoesData(n: number = 1, overide = {}) {
  return Array.from(
    {
      length: n,
    },
    (_, i) => {
      return generateGarrafaoData(overide)
    }
  )
}
