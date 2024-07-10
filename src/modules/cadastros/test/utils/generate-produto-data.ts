import { faker } from '@faker-js/faker'

export function generateNewProdutoData(overide = {}) {
  return {
    nome: faker.datatype.string(45),
    descricao: faker.datatype.string(250),
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generateProdutoData(overide = {}) {
  return {
    id: faker.datatype.uuid(),
    nome: faker.datatype.string(45),
    descricao: faker.datatype.string(250),
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generateProdutosData(n: number = 1, overide = {}) {
  return Array.from(
    {
      length: n,
    },
    (_, i) => {
      return generateProdutoData(overide)
    }
  )
}
