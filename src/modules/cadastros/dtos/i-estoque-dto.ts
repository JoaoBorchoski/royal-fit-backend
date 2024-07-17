interface IEstoqueDTO {
  id?: string
  produtoId?: string
  quantidade?: number
  desabilitado?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export { IEstoqueDTO }
