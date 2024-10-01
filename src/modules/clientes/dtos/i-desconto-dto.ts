interface IDescontoDTO {
  id?: string
  clienteId?: string
  produtoId?: string
  desconto?: number
  desabilitado?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export { IDescontoDTO }
