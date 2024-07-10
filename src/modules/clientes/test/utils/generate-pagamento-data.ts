import { faker } from '@faker-js/faker'

export function generateNewPagamentoData(overide = {}) {
  return {
    clienteId: null,
    valorPago: faker.datatype.number({ max: 9 }),
    meioPagamentoId: null,
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generatePagamentoData(overide = {}) {
  return {
    id: faker.datatype.uuid(),
    clienteId: null,
    valorPago: faker.datatype.number({ max: 9 }),
    meioPagamentoId: null,
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generatePagamentosData(n: number = 1, overide = {}) {
  return Array.from(
    {
      length: n,
    },
    (_, i) => {
      return generatePagamentoData(overide)
    }
  )
}
