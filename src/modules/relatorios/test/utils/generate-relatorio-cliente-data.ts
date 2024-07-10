import { faker } from '@faker-js/faker'

export function generateNewRelatorioClienteData(overide = {}) {
  return {
    clienteId: null,
    relatório: faker.datatype.string(4096),
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generateRelatorioClienteData(overide = {}) {
  return {
    id: faker.datatype.uuid(),
    clienteId: null,
    relatório: faker.datatype.string(4096),
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generateRelatoriosClientesData(n: number = 1, overide = {}) {
  return Array.from(
    {
      length: n,
    },
    (_, i) => {
      return generateRelatorioClienteData(overide)
    }
  )
}
