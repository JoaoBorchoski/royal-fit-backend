interface IRelatorioFuncionarioDTO {
  id?: string
  funcionarioId?: string
  dataInicio?: Date
  dataFim?: Date
  relatório?: string
  desabilitado?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export { IRelatorioFuncionarioDTO }
