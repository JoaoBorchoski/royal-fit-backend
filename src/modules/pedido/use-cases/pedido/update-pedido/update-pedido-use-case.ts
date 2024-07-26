import { inject, injectable } from "tsyringe"
import { Pedido } from "@modules/pedido/infra/typeorm/entities/pedido"
import { IPedidoRepository } from "@modules/pedido/repositories/i-pedido-repository"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse } from "@shared/helpers"
import { IPedidoItemRepository } from "@modules/pedido/repositories/i-pedido-item-repository"
import { IEstoqueRepository } from "@modules/cadastros/repositories/i-estoque-repository"
import { IProdutoRepository } from "@modules/cadastros/repositories/i-produto-repository"
import { getConnection } from "typeorm"
import { IBalancoRepository } from "@modules/clientes/repositories/i-balanco-repository"

interface IRequest {
  id: string
  sequencial: number
  clienteId: string
  data: Date
  hora: string
  valorTotal: number
  desconto: number
  descricao: string
  isLiberado: boolean
  funcionarioId: string
  meioPagamentoId: string
  statusPagamentoId: string
  isPagamentoPosterior: boolean
  desabilitado: boolean
  pedidoItemForm: any[]
}

@injectable()
class UpdatePedidoUseCase {
  constructor(
    @inject("PedidoRepository")
    private pedidoRepository: IPedidoRepository,
    @inject("EstoqueRepository")
    private estoqueRepository: IEstoqueRepository,
    @inject("ProdutoRepository")
    private produtoRepository: IProdutoRepository,
    @inject("PedidoItemRepository")
    private pedidoItemRepository: IPedidoItemRepository,
    @inject("BalancoRepository")
    private balancoRepository: IBalancoRepository
  ) {}

  async execute({
    id,
    sequencial,
    clienteId,
    data,
    hora,
    valorTotal,
    desconto,
    descricao,
    isLiberado,
    funcionarioId,
    meioPagamentoId,
    statusPagamentoId,
    isPagamentoPosterior,
    desabilitado,
    pedidoItemForm,
  }: IRequest): Promise<HttpResponse> {
    const queryRunner = getConnection().createQueryRunner()
    await queryRunner.startTransaction()

    try {
      const oldPedido = await this.pedidoRepository.get(id)
      const oldBalanco = await this.balancoRepository.getByClienteId(clienteId)

      const pedido = await this.pedidoRepository.update(
        {
          id,
          sequencial,
          clienteId,
          data,
          hora,
          valorTotal,
          desconto,
          descricao,
          isLiberado,
          funcionarioId,
          meioPagamentoId,
          statusPagamentoId,
          isPagamentoPosterior,
          desabilitado,
        },
        queryRunner.manager
      )

      if (meioPagamentoId == "9751732c-4ed8-465f-96f1-2d2580b33a5d") {
        await this.balancoRepository.updateWithQueryRunner(
          {
            id: oldBalanco.data.id,
            clienteId,
            saldoDevedor: oldBalanco.data.saldoDevedor - oldPedido.data.valorTotal + valorTotal,
          },
          queryRunner.manager
        )
      }

      for await (const pedidoItem of pedidoItemForm) {
        const estoqueAtual = await this.estoqueRepository.getByProdutoId(pedidoItem.produtoId)
        const produto = await this.produtoRepository.get(pedidoItem.produtoId)
        const item = await this.pedidoItemRepository.getByPedidoIdAndProdutoId(pedido.data.id, pedidoItem.produtoId)

        if (item.data) {
          const novaQuantidade = estoqueAtual.data.quantidade + item.data.quantidade - pedidoItem.quantidade
          if (!estoqueAtual.data || estoqueAtual.data.quantidade + item.data.quantidade < pedidoItem.quantidade) {
            throw new AppError(`Estoque insuficiente ou estoque não cadastrado para o produto ${produto.data.nome}`)
          }

          await this.estoqueRepository.updateEstoqueQuantidade(estoqueAtual.data.id, novaQuantidade, queryRunner.manager)
          await this.pedidoItemRepository.update(
            {
              id: item.data.id,
              pedidoId: pedido.data.id,
              produtoId: pedidoItem.produtoId,
              quantidade: pedidoItem.quantidade,
            },
            queryRunner.manager
          )
        } else {
          const novaQuantidade = estoqueAtual.data.quantidade - pedidoItem.quantidade
          if (!estoqueAtual.data || estoqueAtual.data.quantidade < pedidoItem.quantidade) {
            throw new AppError(`Estoque insuficiente ou estoque não cadastrado para o produto ${produto.data.nome}`)
          }

          await this.estoqueRepository.updateEstoqueQuantidade(estoqueAtual.data.id, novaQuantidade, queryRunner.manager)
          await this.pedidoItemRepository.createWithQueryRunner(
            {
              pedidoId: pedido.data.id,
              produtoId: pedidoItem.produtoId,
              quantidade: pedidoItem.quantidade,
            },
            queryRunner.manager
          )
        }
      }

      await queryRunner.commitTransaction()
      return pedido
    } catch (error) {
      await queryRunner.rollbackTransaction()
      return error
    } finally {
      await queryRunner.release()
    }
  }
}

export { UpdatePedidoUseCase }
