interface IPedidoItemDTO {
  id?: string
  produtoId?: string
  pedidoId?: string
  quantidade?: number
  desabilitado?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export { IPedidoItemDTO }
