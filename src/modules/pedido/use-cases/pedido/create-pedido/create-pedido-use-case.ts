import { inject, injectable } from "tsyringe"
import { Pedido } from "@modules/pedido/infra/typeorm/entities/pedido"
import { IPedidoRepository } from "@modules/pedido/repositories/i-pedido-repository"
import { AppError } from "@shared/errors/app-error"
import { IPedidoItemRepository } from "@modules/pedido/repositories/i-pedido-item-repository"
import { IEstoqueRepository } from "@modules/cadastros/repositories/i-estoque-repository"
import { getConnection } from "typeorm"
import { IProdutoRepository } from "@modules/cadastros/repositories/i-produto-repository"
import { IBonificacaoRepository } from "@modules/cadastros/repositories/i-bonificacao-repository"

interface IRequest {
  sequencial: number
  clienteId: string
  data: Date
  hora: string
  valorTotal: number
  desconto: number
  funcionarioId: string
  meioPagamentoId: string
  statusPagamentoId: string
  isPagamentoPosterior: boolean
  desabilitado: boolean
  pedidoItemForm: any[]
}

@injectable()
class CreatePedidoUseCase {
  constructor(
    @inject("PedidoRepository")
    private pedidoRepository: IPedidoRepository,
    @inject("EstoqueRepository")
    private estoqueRepository: IEstoqueRepository,
    @inject("ProdutoRepository")
    private produtoRepository: IProdutoRepository,
    @inject("PedidoItemRepository")
    private pedidoItemRepository: IPedidoItemRepository,
    @inject("BonificacaoRepository")
    private bonificacaoRepository: IBonificacaoRepository
  ) {}

  async execute({
    sequencial,
    clienteId,
    data,
    hora,
    valorTotal,
    desconto,
    funcionarioId,
    meioPagamentoId,
    statusPagamentoId,
    isPagamentoPosterior,
    desabilitado,
    pedidoItemForm,
  }: IRequest): Promise<Pedido> {
    const queryRunner = getConnection().createQueryRunner()
    await queryRunner.startTransaction()

    try {
      const totalPedidos = await this.pedidoRepository.count("", "")
      const bonificacao = await this.bonificacaoRepository.getByClienteId(clienteId)
      let newBonificacao = 0
      let newTotalVendido = 0

      const result = await this.pedidoRepository
        .createWithQueryRunner(
          {
            sequencial: totalPedidos.data.count + 1,
            clienteId,
            data,
            hora,
            valorTotal,
            desconto,
            funcionarioId,
            meioPagamentoId,
            statusPagamentoId,
            isPagamentoPosterior,
            desabilitado,
          },
          queryRunner.manager
        )
        .then((pedidoResult) => {
          return pedidoResult
        })
        .catch((error) => {
          return error
        })

      for await (const pedidoItem of pedidoItemForm) {
        const estoqueAtual = await this.estoqueRepository.getByProdutoId(pedidoItem.produtoId)
        const produto = await this.produtoRepository.get(pedidoItem.produtoId)

        if (!estoqueAtual.data || estoqueAtual.data.quantidade < pedidoItem.quantidade) {
          throw new AppError(`Estoque insuficiente ou estoque não cadastrado para o produto ${produto.data.nome}`)
        }

        if (
          produto.data.id == "fbe43047-093b-496b-9c59-ce5c2ce66b34" ||
          produto.data.id == "907a8147-dada-4532-82a7-0346666792c9"
        ) {
          newBonificacao += Math.floor(pedidoItem.quantidade / 10)
          newTotalVendido += pedidoItem.quantidade
        }

        await this.estoqueRepository.updateEstoqueQuantidade(
          estoqueAtual.data.id,
          estoqueAtual.data.quantidade - pedidoItem.quantidade,
          queryRunner.manager
        )

        await this.pedidoItemRepository.createWithQueryRunner(
          {
            pedidoId: result.data.id,
            produtoId: pedidoItem.produtoId,
            quantidade: pedidoItem.quantidade,
          },
          queryRunner.manager
        )
      }

      await this.bonificacaoRepository.update({
        id: bonificacao.data.id,
        clienteId: clienteId,
        totalVendido: bonificacao.data.totalVendido + newTotalVendido,
        bonificacaoDisponivel: bonificacao.data.bonificacaoDisponivel + newBonificacao,
      })

      await queryRunner.commitTransaction()
      return result
    } catch (error) {
      console.log("error", error)
      await queryRunner.rollbackTransaction()
      return error
    } finally {
      await queryRunner.release()
    }
  }
}

export { CreatePedidoUseCase }
