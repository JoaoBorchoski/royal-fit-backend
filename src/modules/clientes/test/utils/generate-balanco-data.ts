import { faker } from '@faker-js/faker'

export function generateNewBalancoData(overide = {}) {
  return {
    clienteId: null,
    saldoDevedor: faker.datatype.number({ max: 9 }),
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generateBalancoData(overide = {}) {
  return {
    id: faker.datatype.uuid(),
    clienteId: null,
    saldoDevedor: faker.datatype.number({ max: 9 }),
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generateBalancosData(n: number = 1, overide = {}) {
  return Array.from(
    {
      length: n,
    },
    (_, i) => {
      return generateBalancoData(overide)
    }
  )
}
