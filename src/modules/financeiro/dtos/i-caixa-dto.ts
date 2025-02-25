interface ICaixaDTO {
  id?: string
  descricao?: string
  valor?: number
  data?: Date
  pedidoId?: string
  clienteId?: string
  formaPagamentoId?: string
  createdAt?: Date
  updatedAt?: Date
}

export { ICaixaDTO }
