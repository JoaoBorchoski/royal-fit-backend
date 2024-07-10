import { faker } from '@faker-js/faker'

export function generateNewRelatorioFuncionarioData(overide = {}) {
  return {
    funcionarioId: null,
    relatório: faker.datatype.string(4096),
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generateRelatorioFuncionarioData(overide = {}) {
  return {
    id: faker.datatype.uuid(),
    funcionarioId: null,
    relatório: faker.datatype.string(4096),
    desabilitado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide
  }
}

export function generateRelatoriosFuncionariosData(n: number = 1, overide = {}) {
  return Array.from(
    {
      length: n,
    },
    (_, i) => {
      return generateRelatorioFuncionarioData(overide)
    }
  )
}
