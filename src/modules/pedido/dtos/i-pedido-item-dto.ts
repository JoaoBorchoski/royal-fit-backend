interface IPedidoItemDTO {
  id?: string
  produtoId?: string
  pedidoId?: string
  quantidade?: number
  valor?: number
  valorProduto?: number
  desabilitado?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export { IPedidoItemDTO }
