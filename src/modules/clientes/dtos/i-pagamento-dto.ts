interface IPagamentoDTO {
  id?: string
  clienteId?: string
  valorPago?: number
  meioPagamentoId?: string
  userId?: string
  data?: Date
  desabilitado?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export { IPagamentoDTO }
