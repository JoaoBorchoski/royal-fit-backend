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
import { CharacterSet, PrinterTypes, ThermalPrinter } from "node-thermal-printer"
import { IClienteRepository } from "@modules/cadastros/repositories/i-cliente-repository"
import { IMeioPagamentoRepository } from "@modules/cadastros/repositories/i-meio-pagamento-repository"
import { IGarrafaoRepository } from "@modules/cadastros/repositories/i-garrafao-repository"
import { IPedidoBonificadoRepository } from "@modules/pedido/repositories/i-pedido-bonificado-repository"
import { IBonificacaoRepository } from "@modules/cadastros/repositories/i-bonificacao-repository"

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
  impressoraIp?: string
  tipoEntrega?: number
}

interface IPedidoItemCanhoto {
  produtoNome: string
  quantidade: number
  valorTotal: number
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
    private balancoRepository: IBalancoRepository,
    @inject("ClienteRepository")
    private clienteRepository: IClienteRepository,
    @inject("MeioPagamentoRepository")
    private meioPagamentoRepository: IMeioPagamentoRepository,
    @inject("BonificacaoRepository")
    private bonificacaoRepository: IBonificacaoRepository,
    @inject("GarrafaoRepository")
    private garrafaoRepository: IGarrafaoRepository,
    @inject("PedidoBonificadoRepository")
    private pedidoBonificadoRepository: IPedidoBonificadoRepository
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
    impressoraIp = "45.227.182.222:9100",
    tipoEntrega,
  }: IRequest): Promise<HttpResponse> {
    const queryRunner = getConnection().createQueryRunner()
    await queryRunner.startTransaction()

    try {
      const oldPedido = await this.pedidoRepository.get(id)
      const oldBalanco = await this.balancoRepository.getByClienteId(clienteId)
      const cliente = await this.clienteRepository.get(clienteId)
      const meioPagamento = await this.meioPagamentoRepository.get(meioPagamentoId)
      const garrafoes = await this.garrafaoRepository.getByClienteId(clienteId)
      const bonificacao = await this.bonificacaoRepository.getByClienteId(clienteId)
      let pedidoItemCanhoto: IPedidoItemCanhoto[] = []
      let newBonificacao = 0
      let newTotalVendido = 0

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
          tipoEntrega,
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

          if (item.data.produtoId == "fbe43047-093b-496b-9c59-ce5c2ce66b34") {
            if (!garrafoes.data) {
              throw new AppError(`Cliente não possui garrafão cadastrado`)
            }
            if (garrafoes.data.quantidade + item.data.quantidade < pedidoItem.quantidade) {
              throw new AppError(`Quantidade de garrafões insuficiente`)
            }
            await this.garrafaoRepository.updateWithQueryRunner(
              {
                id: garrafoes.data.id,
                clienteId: clienteId,
                quantidade: garrafoes.data.quantidade + item.data.quantidade - pedidoItem.quantidade,
                desabilitado: false,
              },
              queryRunner.manager
            )
          }

          if (
            item.data.produtoId == "fbe43047-093b-496b-9c59-ce5c2ce66b34" ||
            item.data.produtoId == "907a8147-dada-4532-82a7-0346666792c9"
          ) {
            newBonificacao += Math.floor(pedidoItem.quantidade - item.data.quantidade / 10)
            newTotalVendido += pedidoItem.quantidade - item.data.quantidade
          }

          await this.estoqueRepository.updateEstoqueQuantidade(estoqueAtual.data.id, novaQuantidade, queryRunner.manager)
          const prod = await this.pedidoItemRepository.update(
            {
              id: item.data.id,
              pedidoId: pedido.data.id,
              produtoId: pedidoItem.produtoId,
              quantidade: pedidoItem.quantidade,
              valor: pedidoItem.valor,
            },
            queryRunner.manager
          )

          pedidoItemCanhoto.push({
            produtoNome: produto.data.nome,
            quantidade: +prod.data.quantidade,
            valorTotal: +prod.data.quantidade * +produto.data.preco,
          })
        } else {
          const novaQuantidade = estoqueAtual.data.quantidade - pedidoItem.quantidade
          if (!estoqueAtual.data || estoqueAtual.data.quantidade < pedidoItem.quantidade) {
            throw new AppError(`Estoque insuficiente ou estoque não cadastrado para o produto ${produto.data.nome}`)
          }

          if (produto.data.id == "fbe43047-093b-496b-9c59-ce5c2ce66b34") {
            if (!garrafoes.data) {
              throw new AppError(`Cliente não possui garrafão cadastrado`)
            }
            if (garrafoes.data.quantidade < pedidoItem.quantidade) {
              throw new AppError(`Quantidade de garrafões insuficiente`)
            }
            await this.garrafaoRepository.updateWithQueryRunner(
              {
                id: garrafoes.data.id,
                clienteId: clienteId,
                quantidade: garrafoes.data.quantidade - pedidoItem.quantidade,
                desabilitado: false,
              },
              queryRunner.manager
            )
          }

          if (produto.data.id == "fbe43047-093b-496b-9c59-ce5c2ce66b34" || produto.data.id == "907a8147-dada-4532-82a7-0346666792c9") {
            newBonificacao += Math.floor(pedidoItem.quantidade / 10)
            newTotalVendido += pedidoItem.quantidade
          }

          await this.estoqueRepository.updateEstoqueQuantidade(estoqueAtual.data.id, novaQuantidade, queryRunner.manager)
          const prod = await this.pedidoItemRepository.createWithQueryRunner(
            {
              pedidoId: pedido.data.id,
              produtoId: pedidoItem.produtoId,
              quantidade: pedidoItem.quantidade,
            },
            queryRunner.manager
          )

          pedidoItemCanhoto.push({
            produtoNome: produto.data.nome,
            quantidade: +prod.data.quantidade,
            valorTotal: +prod.data.quantidade * +produto.data.preco,
          })
        }
      }

      let printer = new ThermalPrinter({
        // type: "epson",
        type: PrinterTypes.EPSON,
        interface: `tcp://${impressoraIp}`,
        characterSet: CharacterSet.PC860_PORTUGUESE,
        options: {
          timeout: 5000,
        },
      })

      async function printReceipt() {
        const dataAtual = new Date()
        dataAtual.setHours(dataAtual.getHours() - 3)

        printer.alignCenter()
        printer.setTypeFontB()
        printer.println("Royal Fit")
        printer.newLine()
        printer.drawLine()
        printer.newLine()
        printer.println(`Cliente: ${cliente.data.nome}`)
        printer.println(`Data: ${new Date().toLocaleDateString("pt-BR")}`)
        printer.println(`Hora: ${dataAtual.toLocaleTimeString("pt-BR")}`)
        printer.println(`Status do Pedido: ${isLiberado ? "Liberado" : "Aguardando"}`)
        printer.println(`Meio de Pagamento: ${meioPagamento.data.nome}`)
        printer.newLine()
        printer.drawLine()
        printer.println("Itens do Pedido")
        printer.newLine()
        printer.tableCustom([
          { text: "Produto", align: "LEFT", width: 0.5 },
          { text: "Qtd", align: "CENTER", width: 0.1 },
          { text: "Preço", align: "RIGHT", width: 0.4 },
        ])
        printer.newLine()
        pedidoItemCanhoto.map((item) => {
          const valorFormatado = `R$ ${parseFloat(item.valorTotal.toString().replace(",", ".")).toFixed(2).replace(".", ",")}`
          printer.tableCustom([
            { text: item.produtoNome, align: "LEFT", width: 0.5 },
            { text: item.quantidade.toString(), align: "CENTER", width: 0.1 },
            { text: valorFormatado.trim(), align: "RIGHT", width: 0.4 },
          ])
        })
        printer.newLine()
        printer.println(`Desconto: R$ ${parseFloat(desconto.toString().replace(",", ".")).toFixed(2).replace(".", ",")}`)
        printer.println(
          `Total: R$ ${parseFloat((valorTotal - desconto).toString().replace(",", "."))
            .toFixed(2)
            .replace(".", ",")}`
        )
        printer.drawLine()
        printer.newLine()
        printer.newLine()
        printer.drawLine()
        printer.println("Assinatura do Cliente")
        printer.cut()

        try {
          // console.log(printer.getText())
          await printer.execute()
          console.log("Print success!")
        } catch (error) {
          console.error("Print failed:", error)
        }
      }

      printReceipt()

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
