interface IPedidoDTO {
  id?: string
  sequencial?: number
  clienteId?: string
  data?: Date
  hora?: string
  valorTotal?: number
  desconto?: number
  descricao?: string
  funcionarioId?: string
  meioPagamentoId?: string
  statusPagamentoId?: string
  isPagamentoPosterior?: boolean
  isLiberado?: boolean
  tipoEntrega?: number
  desabilitado?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export { IPedidoDTO }
