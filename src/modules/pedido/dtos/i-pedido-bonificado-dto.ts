interface IPedidoBonificadoDTO {
  id?: string
  clienteId?: string
  quantidade?: number
  data?: Date
  isLiberado?: boolean
  desabilitado?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export { IPedidoBonificadoDTO }
