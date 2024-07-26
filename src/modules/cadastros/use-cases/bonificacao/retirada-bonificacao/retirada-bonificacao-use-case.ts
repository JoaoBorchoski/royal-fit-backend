import { inject, injectable } from "tsyringe"
import { Bonificacao } from "@modules/cadastros/infra/typeorm/entities/bonificacao"
import { IBonificacaoRepository } from "@modules/cadastros/repositories/i-bonificacao-repository"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse } from "@shared/helpers"
import { IPedidoBonificadoRepository } from "@modules/pedido/repositories/i-pedido-bonificado-repository"
import { IGarrafaoRepository } from "@modules/cadastros/repositories/i-garrafao-repository"
import { IProdutoRepository } from "@modules/cadastros/repositories/i-produto-repository"
import { IEstoqueRepository } from "@modules/cadastros/repositories/i-estoque-repository"
import { CharacterSet, PrinterTypes, ThermalPrinter } from "node-thermal-printer"
import { IClienteRepository } from "@modules/cadastros/repositories/i-cliente-repository"

interface IRequest {
  id: string
  clienteId: string
  quantidade: number
}

@injectable()
class RetiradaBonificacaoUseCase {
  constructor(
    @inject("BonificacaoRepository")
    private bonificacaoRepository: IBonificacaoRepository,
    @inject("PedidoBonificadoRepository")
    private pedidoBonificadoRepository: IPedidoBonificadoRepository,
    @inject("GarrafaoRepository")
    private garrafaoRepository: IGarrafaoRepository,
    @inject("ProdutoRepository")
    private produtoRepository: IProdutoRepository,
    @inject("EstoqueRepository")
    private estoqueRepository: IEstoqueRepository,
    @inject("ClienteRepository")
    private clienteRepository: IClienteRepository
  ) {}

  async execute({ id, clienteId, quantidade }: IRequest): Promise<HttpResponse> {
    try {
      const garrafao = await this.garrafaoRepository.getByClienteId(clienteId)
      const oldBonificacao = await this.bonificacaoRepository.getByClienteId(clienteId)
      const produto = await this.produtoRepository.getByname("20L - Envase")
      const oldEstoque = await this.estoqueRepository.getByProdutoId(produto.data.id)
      const cliente = await this.clienteRepository.get(clienteId)

      if (!garrafao.data || garrafao.data.quantidade < quantidade) {
        throw new AppError("Quantidade de garrafões insuficiente")
      }

      if (!oldBonificacao.data || oldBonificacao.data.bonificacaoDisponivel < quantidade) {
        throw new AppError("Quantidade de bonificação insuficiente")
      }

      if (!oldEstoque.data || oldEstoque.data.quantidade < quantidade) {
        throw new AppError("Quantidade de estoque insuficiente")
      }

      await this.garrafaoRepository.update({
        id: garrafao.data.id,
        clienteId,
        quantidade: garrafao.data.quantidade - quantidade,
        desabilitado: false,
      })

      await this.estoqueRepository.update({
        id: oldEstoque.data.id,
        produtoId: produto.data.id,
        quantidade: oldEstoque.data.quantidade - quantidade,
      })

      const bonificacao = await this.bonificacaoRepository.update({
        id: oldBonificacao.data.id,
        clienteId,
        bonificacaoDisponivel: oldBonificacao.data.bonificacaoDisponivel - quantidade,
      })

      await this.pedidoBonificadoRepository.create({
        clienteId,
        quantidade,
        data: new Date(),
        isLiberado: false,
        desabilitado: false,
      })

      let printer = new ThermalPrinter({
        type: PrinterTypes.EPSON, // recomendar usar EPSON
        interface: "tcp://IP_DA_IMPRESSORA:PORTA", // Pode ser 'tcp://', 'usb://', ou 'serial://'
        characterSet: CharacterSet.PC860_PORTUGUESE,
        options: {
          timeout: 5000,
        },
      })

      async function printReceipt() {
        printer.alignCenter()
        printer.println("Royal Fit")
        printer.newLine()
        printer.drawLine()
        printer.newLine()
        printer.println(`Cliente: ${cliente.data.nome}`)
        printer.println(`Retirada de: ${quantidade} Bonificações`)
        printer.println(`Data: ${new Date().toLocaleDateString("pt-BR")}`)
        printer.newLine()
        printer.drawLine()
        printer.newLine()
        printer.newLine()
        printer.drawLine()
        printer.println("Assinatura")
        printer.cut()

        try {
          // console.log(printer.getText())
          // await printer.execute();
          console.log("Print success!")
        } catch (error) {
          console.error("Print failed:", error)
        }
      }

      printReceipt()

      return bonificacao
    } catch (error) {
      return error
    }
  }
}

export { RetiradaBonificacaoUseCase }
