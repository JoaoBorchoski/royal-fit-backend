import { inject, injectable } from "tsyringe"
import { Garrafao } from "@modules/cadastros/infra/typeorm/entities/garrafao"
import { IGarrafaoRepository } from "@modules/cadastros/repositories/i-garrafao-repository"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse, serverError } from "@shared/helpers"
import { CharacterSet, PrinterTypes, ThermalPrinter } from "node-thermal-printer"
import { IClienteRepository } from "@modules/cadastros/repositories/i-cliente-repository"
import { IEstoqueRepository } from "@modules/cadastros/repositories/i-estoque-repository"
import { IBonificacaoRepository } from "@modules/cadastros/repositories/i-bonificacao-repository"
import { IPedidoBonificadoRepository } from "@modules/pedido/repositories/i-pedido-bonificado-repository"
import { IEntradaGarrafaoRepository } from "@modules/cadastros/repositories/i-entrada-garrafao-repository"
import { getConnection } from "typeorm"

interface IRequest {
  id: string
  clienteId: string
  quantidade: number
  impressoraIp?: string
  isRoyalfit: boolean
  tamanhoCasco: number
}

@injectable()
class AddGarrafaoUseCase {
  constructor(
    @inject("GarrafaoRepository")
    private garrafaoRepository: IGarrafaoRepository,
    @inject("ClienteRepository")
    private clienteRepository: IClienteRepository,
    @inject("EstoqueRepository")
    private estoqueRepository: IEstoqueRepository,
    @inject("BonificacaoRepository")
    private bonificacaoRepository: IBonificacaoRepository,
    @inject("PedidoBonificadoRepository")
    private pedidoBonificadoRepository: IPedidoBonificadoRepository,
    @inject("EntradaGarrafaoRepository")
    private entradaGarrafaoRepository: IEntradaGarrafaoRepository
  ) {}

  async execute({
    id,
    clienteId,
    quantidade,
    impressoraIp = "45.227.182.222:9100",
    isRoyalfit,
    tamanhoCasco,
  }: IRequest): Promise<HttpResponse> {
    const queryRunner = getConnection().createQueryRunner()
    await queryRunner.startTransaction()

    try {
      const oldGarrafao = await this.garrafaoRepository.getByClienteId(clienteId)
      const cliente = await this.clienteRepository.get(clienteId)
      const estoque = await this.estoqueRepository.getByProdutoId("fbe43047-093b-496b-9c59-ce5c2ce66b34")
      const estoque10LRetornavel = await this.estoqueRepository.getByProdutoId("83ee8914-44d9-48be-9b9b-55057bb44787") // 28f4726e-db0f-4d48-88a0-64f0ec4d697b
      const bonificacao = await this.bonificacaoRepository.getByClienteId(clienteId)

      let result

      if (tamanhoCasco == 10) {
        const entrada10L = await this.entradaGarrafaoRepository.createWithQueryRunner(
          {
            clienteId,
            quantidade,
            isRoyalfit,
            tamanhoCasco,
          },
          queryRunner.manager
        )

        await this.estoqueRepository.updateEstoqueQuantidade(
          estoque10LRetornavel.data.id,
          estoque10LRetornavel.data.quantidade + quantidade,
          queryRunner.manager
        )

        result = entrada10L
      } else {
        const garrafao = await this.garrafaoRepository.updateWithQueryRunner(
          {
            id: oldGarrafao.data.id,
            clienteId,
            quantidade: oldGarrafao.data.quantidade + quantidade,
          },
          queryRunner.manager
        )

        result = garrafao

        await this.estoqueRepository.updateEstoqueQuantidade(estoque.data.id, estoque.data.quantidade + quantidade, queryRunner.manager)

        await this.entradaGarrafaoRepository.createWithQueryRunner(
          {
            clienteId,
            quantidade,
            isRoyalfit,
            tamanhoCasco,
          },
          queryRunner.manager
        )

        if (isRoyalfit) {
          const totalDisponivel = +bonificacao.data.bonificacaoDisponivel
          const novaEntrada = quantidade / 10
          const novoTotal = totalDisponivel + novaEntrada

          await this.bonificacaoRepository.updateWithQueryRunner(
            {
              id: bonificacao.data.id,
              clienteId: clienteId,
              totalVendido: bonificacao.data.totalVendido + quantidade,
              bonificacaoDisponivel: novoTotal,
            },
            queryRunner.manager
          )

          // const totalVendidoAtual = bonificacao.data.totalVendido + quantidade
          // const totalBonificacoesPossiveis = Math.floor(totalVendidoAtual / 10)
          // const bonificacoesUsadas = await this.pedidoBonificadoRepository.getBonificacoesUsadas(clienteId)
          // const totalBonificacoesDisponiveis = totalBonificacoesPossiveis - bonificacoesUsadas.data.quantidade
          // const bonificacaoDup = cliente.data.bonificacaoDuplicada ? 2 : 1
          // await this.bonificacaoRepository.updateWithQueryRunner(
          //   {
          //     id: bonificacao.data.id,
          //     clienteId: clienteId,
          //     totalVendido: bonificacao.data.totalVendido + quantidade,
          //     bonificacaoDisponivel: totalBonificacoesDisponiveis < 0 ? 0 : totalBonificacoesDisponiveis * bonificacaoDup,
          //   },
          //   queryRunner.manager
          // )
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
        printer.drawLine()
        printer.println(`Cliente: ${cliente.data.nome}`)
        printer.println(`Entrada de: ${quantidade} garrafões`)
        printer.println(`Tipo do Garrafão: ${tamanhoCasco}L`)
        printer.println(`Tipo do Casco: ${isRoyalfit ? "Royalfit" : "Não Royalfit"}`)
        printer.println(`Data: ${new Date().toLocaleDateString("pt-BR")}`)
        printer.println(`Hora: ${dataAtual.toLocaleTimeString("pt-BR")}`)
        printer.drawLine()
        printer.newLine()
        printer.newLine()
        printer.drawLine()
        printer.println("Assinatura do Cliente")
        printer.cut()
        printer.newLine()
        printer.alignCenter()
        printer.setTypeFontB()
        printer.println("Royal Fit")
        printer.drawLine()
        printer.println(`Cliente: ${cliente.data.nome}`)
        printer.println(`Entrada de: ${quantidade} garrafões`)
        printer.println(`Tipo do Garrafão: ${tamanhoCasco}L`)
        printer.println(`Tipo do Casco: ${isRoyalfit ? "Royalfit" : "Não Royalfit"}`)
        printer.println(`Data: ${new Date().toLocaleDateString("pt-BR")}`)
        printer.println(`Hora: ${dataAtual.toLocaleTimeString("pt-BR")}`)
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
    } catch (error) {
      console.log("error", error)
      await queryRunner.rollbackTransaction()
      return error
    } finally {
      await queryRunner.release()
    }
  }
}

export { AddGarrafaoUseCase }
