interface IClienteDTO {
  id?: string
  nome?: string
  cpfCnpj?: string
  email?: string
  isBonificado?: boolean
  desconto?: number
  cep?: string
  estadoId?: string
  cidadeId?: string
  bairro?: string
  endereco?: string
  numero?: number
  complemento?: string
  telefone?: string
  usuarioId?: string
  desabilitado?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export { IClienteDTO }
