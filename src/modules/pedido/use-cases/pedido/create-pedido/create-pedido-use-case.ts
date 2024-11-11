import { inject, injectable } from "tsyringe"
import { Pedido } from "@modules/pedido/infra/typeorm/entities/pedido"
import { IPedidoRepository } from "@modules/pedido/repositories/i-pedido-repository"
import { AppError } from "@shared/errors/app-error"
import { IPedidoItemRepository } from "@modules/pedido/repositories/i-pedido-item-repository"
import { IEstoqueRepository } from "@modules/cadastros/repositories/i-estoque-repository"
import { getConnection } from "typeorm"
import { IProdutoRepository } from "@modules/cadastros/repositories/i-produto-repository"
import { IBonificacaoRepository } from "@modules/cadastros/repositories/i-bonificacao-repository"
import { IGarrafaoRepository } from "@modules/cadastros/repositories/i-garrafao-repository"
import { IBalancoRepository } from "@modules/clientes/repositories/i-balanco-repository"
import { noContent } from "@shared/helpers"
import { IClienteRepository } from "@modules/cadastros/repositories/i-cliente-repository"
import { CharacterSet, PrinterTypes, ThermalPrinter } from "node-thermal-printer"
import { IMeioPagamentoRepository } from "@modules/cadastros/repositories/i-meio-pagamento-repository"

interface IRequest {
  sequencial: number
  clienteId: string
  data: Date
  hora: string
  valorTotal: number
  desconto: number
  descricao: string
  funcionarioId: string
  meioPagamentoId: string
  statusPagamentoId: string
  isPagamentoPosterior: boolean
  isLiberado: boolean
  desabilitado: boolean
  pedidoItemForm: any[]
  impressoraIp: string
  tipoEntrega: number
}

interface IPedidoItemCanhoto {
  produtoNome: string
  quantidade: number
  valorTotal: number
  preco: number
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
    private bonificacaoRepository: IBonificacaoRepository,
    @inject("GarrafaoRepository")
    private garrafaoRepository: IGarrafaoRepository,
    @inject("BalancoRepository")
    private balancoRepository: IBalancoRepository,
    @inject("ClienteRepository")
    private clienteRepository: IClienteRepository,
    @inject("MeioPagamentoRepository")
    private meioPagamentoRepository: IMeioPagamentoRepository
  ) {}

  async execute({
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
    impressoraIp = "45.227.182.222:9100",
    pedidoItemForm,
    tipoEntrega,
  }: IRequest): Promise<Pedido> {
    const queryRunner = getConnection().createQueryRunner()
    await queryRunner.startTransaction()

    try {
      const totalPedidos = await this.pedidoRepository.count("", "")
      const bonificacao = await this.bonificacaoRepository.getByClienteId(clienteId)
      const cliente = await this.clienteRepository.get(clienteId)
      const meioPagamento = await this.meioPagamentoRepository.get(meioPagamentoId)
      let newBonificacao = 0
      let newTotalVendido = 0
      let pedidoItemCanhoto: IPedidoItemCanhoto[] = []

      const result = await this.pedidoRepository
        .createWithQueryRunner(
          {
            sequencial: totalPedidos.data.count + 1,
            clienteId,
            data,
            hora,
            valorTotal,
            desconto,
            descricao,
            funcionarioId,
            meioPagamentoId,
            isPagamentoPosterior,
            isLiberado,
            desabilitado,
            tipoEntrega,
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
        console.log("pedidoItem", pedidoItem)

        const estoqueAtual = await this.estoqueRepository.getByProdutoId(pedidoItem.produtoId)
        const produto = await this.produtoRepository.get(pedidoItem.produtoId)
        const garrafoes = await this.garrafaoRepository.getByClienteId(clienteId)

        // console.log("estoqueAtual", estoqueAtual)
        // console.log("estoqueAtual.data.quantidade", estoqueAtual.data.quantidade)
        // console.log("pedidoItem.quantidade", pedidoItem.quantidade)

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

        const prod = await this.pedidoItemRepository.createWithQueryRunner(
          {
            id: pedidoItem.id,
            pedidoId: result.data.id,
            produtoId: pedidoItem.produtoId,
            quantidade: pedidoItem.quantidade,
            valor: pedidoItem.valor,
            valorProduto: produto.data.preco,
          },
          queryRunner.manager
        )

        const produtoIdEspecial = "fbe43047-093b-496b-9c59-ce5c2ce66b34"
        const isProdutoEspecial = produto.data.id === produtoIdEspecial
        let precoCanhoto = +pedidoItem.preco

        const aplicarPreco = (faixas: { limite: number; preco: number }[]) => {
          const faixa = faixas.find((f) => pedidoItem.quantidade <= f.limite) || faixas[faixas.length - 1]

          precoCanhoto = faixa.preco
        }

        if (isProdutoEspecial) {
          if (tipoEntrega === 1) {
            aplicarPreco([
              { limite: 49, preco: 5.8 },
              { limite: 99, preco: 5.7 },
              { limite: Infinity, preco: 5.6 },
            ])
          } else if (tipoEntrega === 2) {
            aplicarPreco([
              { limite: 19, preco: 6.9 },
              { limite: 29, preco: 6.8 },
              { limite: 49, preco: 6.5 },
              { limite: Infinity, preco: 6.4 },
            ])
          } else if (tipoEntrega === 3) {
            aplicarPreco([{ limite: Infinity, preco: 7.95 }])
          } else if (tipoEntrega === 4) {
            aplicarPreco([{ limite: Infinity, preco: 6.7 }])
          }
        }

        pedidoItemCanhoto.push({
          produtoNome: produto.data.nome,
          quantidade: +prod.data.quantidade,
          valorTotal: isProdutoEspecial ? +prod.data.quantidade * +precoCanhoto : pedidoItem.valor,
          preco: +precoCanhoto,
        })
      }

      // if (statusPagamentoId == "58922f62-67e4-4f50-8e0d-2bcb89f95f9a") {
      if (meioPagamentoId == "9751732c-4ed8-465f-96f1-2d2580b33a5d") {
        const balanco = await this.balancoRepository.getByClienteIdWithQueryRunner(clienteId, queryRunner.manager)
        await this.balancoRepository.updateWithQueryRunner(
          {
            id: balanco.data.id,
            clienteId: clienteId,
            saldoDevedor: balanco.data.saldoDevedor + valorTotal,
          },
          queryRunner.manager
        )
      }

      // await this.bonificacaoRepository.updateWithQueryRunner(
      //   {
      //     id: bonificacao.data.id,
      //     clienteId: clienteId,
      //     totalVendido: bonificacao.data.totalVendido + newTotalVendido,
      //     bonificacaoDisponivel: bonificacao.data.bonificacaoDisponivel + newBonificacao,
      //   },
      //   queryRunner.manager
      // )

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
          { text: "Uni", align: "CENTER", width: 0.1 },
          { text: "Preço", align: "RIGHT", width: 0.3 },
        ])
        printer.newLine()
        pedidoItemCanhoto.map((item) => {
          printer.tableCustom([
            { text: item.produtoNome, align: "LEFT", width: 0.5 },
            { text: item.quantidade.toString(), align: "CENTER", width: 0.1 },
            { text: item.preco.toString(), align: "CENTER", width: 0.1 },
            {
              text: `R$ ${parseFloat(item.valorTotal.toString().replace(",", ".")).toFixed(2).replace(".", ",")}`,
              align: "RIGHT",
              width: 0.3,
            },
          ])
        })
        printer.newLine()
        printer.println(
          `Desconto: R$ ${parseFloat(desconto.toString().replace(",", ".")).toFixed(2).replace(".", ",")} ${desconto}`
        )
        printer.println(
          `Total: R$ ${parseFloat((valorTotal - desconto).toString().replace(",", "."))
            .toFixed(2)
            .replace(".", ",")}`
        )
        printer.newLine()
        printer.println(`Total: R$ ${valorTotal}`)
        printer.drawLine()
        printer.newLine()
        printer.newLine()
        printer.drawLine()
        printer.println("Assinatura do Cliente")
        printer.cut()
        printer.newLine()
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
          { text: "Uni", align: "CENTER", width: 0.1 },
          { text: "Preço", align: "RIGHT", width: 0.3 },
        ])
        printer.newLine()
        pedidoItemCanhoto.map((item) => {
          printer.tableCustom([
            { text: item.produtoNome, align: "LEFT", width: 0.5 },
            { text: item.quantidade.toString(), align: "CENTER", width: 0.1 },
            { text: item.preco.toString(), align: "CENTER", width: 0.1 },
            {
              text: `R$ ${parseFloat(item.valorTotal.toString().replace(",", ".")).toFixed(2).replace(".", ",")}`,
              align: "RIGHT",
              width: 0.3,
            },
          ])
        })
        printer.newLine()
        printer.println(
          `Desconto: R$ ${parseFloat(desconto.toString().replace(",", ".")).toFixed(2).replace(".", ",")} ${desconto}`
        )
        printer.println(
          `Total: R$ ${parseFloat((valorTotal - desconto).toString().replace(",", "."))
            .toFixed(2)
            .replace(".", ",")}`
        )
        printer.newLine()
        printer.println(`Total: R$ ${valorTotal}`)
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
      return result
      // return noContent()
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
