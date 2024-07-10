import { faker } from '@faker-js/faker'

export function generateNewBonificacaoData(overide = {}) {
  return {
    clienteId: null,
    totalVendido: faker.datatype.number({ max: 9 }),
    bonificacaoDisponivel: faker.datatype.number({ max: 9 }),
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generateBonificacaoData(overide = {}) {
  return {
    id: faker.datatype.uuid(),
    clienteId: null,
    totalVendido: faker.datatype.number({ max: 9 }),
    bonificacaoDisponivel: faker.datatype.number({ max: 9 }),
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generateBonificacoesData(n: number = 1, overide = {}) {
  return Array.from(
    {
      length: n,
    },
    (_, i) => {
      return generateBonificacaoData(overide)
    }
  )
}
