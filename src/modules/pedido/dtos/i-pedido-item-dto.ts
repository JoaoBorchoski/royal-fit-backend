interface IPedidoItemDTO {
  id?: string
  produtoId?: string
  pedidoId?: string
  quantidade?: number
  valor?: number
  desabilitado?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export { IPedidoItemDTO }
