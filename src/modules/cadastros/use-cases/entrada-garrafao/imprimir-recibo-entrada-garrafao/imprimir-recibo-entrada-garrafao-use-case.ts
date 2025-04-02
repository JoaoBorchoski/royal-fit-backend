import { inject, injectable } from "tsyringe"
import { HttpResponse } from "@shared/helpers"
import { IEntradaGarrafaoRepository } from "@modules/cadastros/repositories/i-entrada-garrafao-repository"
import { CharacterSet, printer, PrinterTypes, ThermalPrinter } from "node-thermal-printer"

@injectable()
class ImprimirReciboEntradaGarrafaoUseCase {
  constructor(
    @inject("EntradaGarrafaoRepository")
    private entradaGarrafaoRepository: IEntradaGarrafaoRepository
  ) {}

  async execute(entradaId: string, impressoraIp: string = "45.227.182.222:9100"): Promise<HttpResponse> {
    const entradaGarrafao = await this.entradaGarrafaoRepository.get(entradaId)

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
      const dataAtual = new Date(entradaGarrafao.data.data)
      // dataAtual.setHours(dataAtual.getHours() - 3)

      printer.alignCenter()
      printer.setTypeFontB()
      printer.println("Royal Fit")
      printer.drawLine()
      printer.println(`Cliente: ${entradaGarrafao.data.clienteNome}`)
      printer.println(`Entrada de: ${entradaGarrafao.data.quantidade} garrafões`)
      printer.println(`Tipo do Garrafão: ${entradaGarrafao.data.tamanhoCasco}L`)
      printer.println(`Tipo do Casco: ${entradaGarrafao.data.isRoyalfit ? "Royalfit" : "Não Royalfit"}`)
      printer.println(`Data: ${new Date(entradaGarrafao.data.data).toLocaleDateString("pt-BR")}`)
      printer.println(`Hora: ${dataAtual.toLocaleTimeString("pt-BR")}`)
      printer.drawLine()
      printer.newLine()
      printer.newLine()
      printer.drawLine()
      printer.println("Assinatura do Cliente")
      printer.cut()
      // printer.newLine()
      // printer.alignCenter()
      // printer.setTypeFontB()
      // printer.println("Royal Fit")
      // printer.drawLine()
      // printer.println(`Cliente: ${entradaGarrafao.data.clienteNome}`)
      // printer.println(`Entrada de: ${entradaGarrafao.data.quantidade} garrafões`)
      // printer.println(`Tipo do Garrafão: ${entradaGarrafao.data.tamanhoCasco}L`)
      // printer.println(`Tipo do Casco: ${entradaGarrafao.data.isRoyalfit ? "Royalfit" : "Não Royalfit"}`)
      // printer.println(`Data: ${new Date(entradaGarrafao.data.data).toLocaleDateString("pt-BR")}`)
      // printer.println(`Hora: ${dataAtual.toLocaleTimeString("pt-BR")}`)
      // printer.drawLine()
      // printer.newLine()
      // printer.newLine()
      // printer.drawLine()
      // printer.println("Assinatura do Cliente")
      // printer.cut()

      try {
        // console.log(printer.getText())
        await printer.execute()
        console.log("Print success!")
      } catch (error) {
        console.error("Print failed:", error)
      }
    }

    printReceipt()

    return entradaGarrafao
  }
}

export { ImprimirReciboEntradaGarrafaoUseCase }
