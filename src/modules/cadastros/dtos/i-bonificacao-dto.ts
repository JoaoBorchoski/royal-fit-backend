interface IBonificacaoDTO {
  id?: string
  clienteId?: string
  totalVendido?: number
  bonificacaoDisponivel?: number
  desabilitado?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export { IBonificacaoDTO }
