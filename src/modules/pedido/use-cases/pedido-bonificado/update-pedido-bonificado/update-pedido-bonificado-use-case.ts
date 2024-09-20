import { inject, injectable } from "tsyringe"
import { PedidoBonificado } from "@modules/pedido/infra/typeorm/entities/pedido-bonificado"
import { IPedidoBonificadoRepository } from "@modules/pedido/repositories/i-pedido-bonificado-repository"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse } from "@shared/helpers"
import { CharacterSet, PrinterTypes, ThermalPrinter } from "node-thermal-printer"
import { IClienteRepository } from "@modules/cadastros/repositories/i-cliente-repository"

interface IRequest {
  id: string
  clienteId: string
  quantidade: number
  data: Date
  isLiberado: boolean
  desabilitado: boolean
  impressoraIp?: string
}

@injectable()
class UpdatePedidoBonificadoUseCase {
  constructor(
    @inject("PedidoBonificadoRepository")
    private pedidoBonificadoRepository: IPedidoBonificadoRepository,
    @inject("ClienteRepository")
    private clienteRepository: IClienteRepository
  ) {}

  async execute({
    id,
    clienteId,
    quantidade,
    data,
    isLiberado,
    impressoraIp = "45.227.182.222:9100",
    desabilitado,
  }: IRequest): Promise<HttpResponse> {
    const cliente = await this.clienteRepository.get(clienteId)

    const pedidoBonificado = await this.pedidoBonificadoRepository.update({
      id,
      clienteId,
      quantidade,
      data,
      isLiberado,
      desabilitado,
    })

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
      printer.println("Royal Fit")
      printer.newLine()
      printer.drawLine()
      printer.newLine()
      printer.println(`Cliente: ${cliente.data.nome}`)
      printer.println(`Retirada de: ${quantidade} Bonificações`)
      printer.println(`Data: ${new Date().toLocaleDateString("pt-BR")}`)
      printer.println(`Hora: ${dataAtual.toLocaleTimeString("pt-BR")}`)
      printer.newLine()
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

    return pedidoBonificado
  }
}

export { UpdatePedidoBonificadoUseCase }
