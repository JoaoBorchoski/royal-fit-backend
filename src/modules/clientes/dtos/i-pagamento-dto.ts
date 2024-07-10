interface IPagamentoDTO {
  id?: string
  clienteId?: string
  valorPago?: number
  meioPagamentoId?: string
  desabilitado?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export { IPagamentoDTO }
