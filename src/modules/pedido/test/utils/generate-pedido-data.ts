import { faker } from '@faker-js/faker'

export function generateNewPedidoData(overide = {}) {
  return {
    sequencial: faker.datatype.number({ max: 9 }),
    clienteId: null,
    hora: faker.datatype.string(5),
    funcionarioId: null,
    meioPagamentoId: null,
    statusPagamentoId: null,
    isPagamentoPosterior: false,
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generatePedidoData(overide = {}) {
  return {
    id: faker.datatype.uuid(),
    sequencial: faker.datatype.number({ max: 9 }),
    clienteId: null,
    hora: faker.datatype.string(5),
    funcionarioId: null,
    meioPagamentoId: null,
    statusPagamentoId: null,
    isPagamentoPosterior: false,
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generatePedidosData(n: number = 1, overide = {}) {
  return Array.from(
    {
      length: n,
    },
    (_, i) => {
      return generatePedidoData(overide)
    }
  )
}
