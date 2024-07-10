interface IRelatorioClienteDTO {
  id?: string
  clienteId?: string
  dataInicio?: Date
  dataFim?: Date
  relatório?: string
  desabilitado?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export { IRelatorioClienteDTO }
