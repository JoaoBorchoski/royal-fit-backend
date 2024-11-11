import { inject, injectable } from "tsyringe"
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
  impressao?: boolean
}

interface IPedidoItemCanhoto {
  produtoNome: string
  quantidade: number
  valorTotal: number
  preco?: number
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
    @inject("GarrafaoRepository")
    private garrafaoRepository: IGarrafaoRepository
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
    impressao,
  }: IRequest): Promise<HttpResponse> {
    const queryRunner = getConnection().createQueryRunner()
    await queryRunner.startTransaction()

    try {
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
      let pedidoItemCanhoto: IPedidoItemCanhoto[] = []
      const cliente = await this.clienteRepository.get(clienteId)
      const meioPagamento = await this.meioPagamentoRepository.get(meioPagamentoId)

      if (!impressao || impressao != true) {
        const oldPedido = await this.pedidoRepository.get(id)
        const oldBalanco = await this.balancoRepository.getByClienteId(clienteId)
        const garrafoes = await this.garrafaoRepository.getByClienteId(clienteId)
        const items = await this.pedidoItemRepository.getByPedidoId(id)

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

        const verificarEstoqueEGarrafao = async (produtoId, quantidade, item, garrafoes, clienteId, queryRunner) => {
          if (produtoId === "fbe43047-093b-496b-9c59-ce5c2ce66b34") {
            if (!garrafoes.data) {
              throw new AppError(`Cliente não possui garrafão cadastrado`)
            }
            if (garrafoes.data.quantidade + item.data.quantidade < quantidade) {
              throw new AppError(`Quantidade de garrafões insuficiente`)
            }
            await this.garrafaoRepository.updateWithQueryRunner(
              {
                id: garrafoes.data.id,
                clienteId: clienteId,
                quantidade: garrafoes.data.quantidade + item.data.quantidade - quantidade,
                desabilitado: false,
              },
              queryRunner.manager
            )
          }
        }

        for await (const pedidoItem of pedidoItemForm) {
          const estoqueAtual = await this.estoqueRepository.getByProdutoId(pedidoItem.produtoId)
          const produto = await this.produtoRepository.get(pedidoItem.produtoId)

          const pedidoItemExistente = items.data.find((item) => item.produtoId === pedidoItem.produtoId)

          const verificarQuantidadeEstoque = (quantidadeEstoque: number, quantidadePedido: number, quantidadeAdicional: number = 0) => {
            return !quantidadeEstoque || quantidadeEstoque < quantidadePedido || quantidadeEstoque + quantidadeAdicional < quantidadePedido
          }

          if (verificarQuantidadeEstoque(estoqueAtual.data.quantidade, pedidoItem.quantidade, pedidoItemExistente?.quantidade || 0)) {
            throw new AppError(`Estoque insuficiente ou não cadastrado para o produto ${produto.data.nome}`)
          }

          const novaQuantidade = estoqueAtual.data.quantidade - pedidoItem.quantidade

          const processarPedidoItem = async (
            produtoId: string,
            quantidade: number,
            valor: number,
            pedidoId: string,
            pedidoItemId?: string
          ) => {
            await this.pedidoItemRepository.createWithQueryRunner(
              {
                id: pedidoItemId,
                pedidoId,
                produtoId,
                quantidade,
                valor,
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
              quantidade,
              valorTotal: quantidade * +precoCanhoto,
            })

            // pedidoItemCanhoto.push({
            //   produtoNome: produto.data.nome,
            //   quantidade,
            //   valorTotal: quantidade * produto.data.preco,
            // })
          }

          if (pedidoItemExistente) {
            await verificarEstoqueEGarrafao(
              produto.data.id,
              pedidoItem.quantidade,
              { data: pedidoItemExistente },
              garrafoes,
              clienteId,
              queryRunner
            )

            await this.pedidoItemRepository.deleteByPedidoIdWithQueryRunner(pedidoItemExistente.id, queryRunner.manager)
            await this.estoqueRepository.updateEstoqueQuantidade(estoqueAtual.data.id, novaQuantidade, queryRunner.manager)

            await processarPedidoItem(pedidoItem.produtoId, pedidoItem.quantidade, pedidoItem.valor, pedido.data.id)
          } else {
            await verificarEstoqueEGarrafao(
              produto.data.id,
              pedidoItem.quantidade,
              { data: { quantidade: 0 } },
              garrafoes,
              clienteId,
              queryRunner
            )

            await this.estoqueRepository.updateEstoqueQuantidade(estoqueAtual.data.id, novaQuantidade, queryRunner.manager)
            await processarPedidoItem(pedidoItem.produtoId, pedidoItem.quantidade, pedidoItem.valor, pedido.data.id, pedidoItem.id)
          }
        }
      }
      if (impressao) {
        for await (const pedidoItem of pedidoItemForm) {
          const produto = await this.produtoRepository.get(pedidoItem.produtoId)

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
            quantidade: +pedidoItem.quantidade,
            valorTotal: +pedidoItem.quantidade * +precoCanhoto,
            preco: +precoCanhoto,
          })

          // pedidoItemCanhoto.push({
          //   produtoNome: produto.data.nome,
          //   quantidade: +pedidoItem.quantidade,
          //   valorTotal: +pedidoItem.quantidade * +produto.data.preco,
          // })
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
      console.log(error)
      await queryRunner.rollbackTransaction()
      return error
    } finally {
      await queryRunner.release()
    }
  }
}

export { UpdatePedidoUseCase }
