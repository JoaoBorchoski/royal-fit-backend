interface IPagamentoDTO {
  id?: string
  clienteId?: string
  valorPago?: number
  meioPagamentoId?: string
  data?: Date
  desabilitado?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export { IPagamentoDTO }
