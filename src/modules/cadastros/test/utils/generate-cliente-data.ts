import { faker } from '@faker-js/faker'

export function generateNewClienteData(overide = {}) {
  return {
    nome: faker.datatype.string(45),
    cpfCnpj: faker.datatype.string(14),
    email: faker.datatype.string(200),
    cep: faker.datatype.string(10),
    estadoId: null,
    cidadeId: null,
    bairro: faker.datatype.string(60),
    endereco: faker.datatype.string(255),
    numero: faker.datatype.number({ max: 9 }),
    complemento: faker.datatype.string(60),
    telefone: faker.datatype.string(13),
    usuarioId: null,
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generateClienteData(overide = {}) {
  return {
    id: faker.datatype.uuid(),
    nome: faker.datatype.string(45),
    cpfCnpj: faker.datatype.string(14),
    email: faker.datatype.string(200),
    cep: faker.datatype.string(10),
    estadoId: null,
    cidadeId: null,
    bairro: faker.datatype.string(60),
    endereco: faker.datatype.string(255),
    numero: faker.datatype.number({ max: 9 }),
    complemento: faker.datatype.string(60),
    telefone: faker.datatype.string(13),
    usuarioId: null,
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generateClientesData(n: number = 1, overide = {}) {
  return Array.from(
    {
      length: n,
    },
    (_, i) => {
      return generateClienteData(overide)
    }
  )
}
