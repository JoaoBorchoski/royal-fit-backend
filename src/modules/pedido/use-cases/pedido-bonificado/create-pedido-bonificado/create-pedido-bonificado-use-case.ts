import { inject, injectable } from "tsyringe"
import { PedidoBonificado } from "@modules/pedido/infra/typeorm/entities/pedido-bonificado"
import { IPedidoBonificadoRepository } from "@modules/pedido/repositories/i-pedido-bonificado-repository"
import { AppError } from "@shared/errors/app-error"
import { IGarrafaoRepository } from "@modules/cadastros/repositories/i-garrafao-repository"
import { IClienteRepository } from "@modules/cadastros/repositories/i-cliente-repository"
import { CharacterSet, PrinterTypes, ThermalPrinter } from "node-thermal-printer"

interface IRequest {
  clienteId: string
  quantidade: number
  data: Date
  isLiberado: boolean
  desabilitado: boolean
  impressoraIp?: string
}

@injectable()
class CreatePedidoBonificadoUseCase {
  constructor(
    @inject("PedidoBonificadoRepository")
    private pedidoBonificadoRepository: IPedidoBonificadoRepository,
    @inject("GarrafaoRepository")
    private garrafaoRepository: IGarrafaoRepository,
    @inject("ClienteRepository")
    private clienteRepository: IClienteRepository
  ) {}

  async execute({
    clienteId,
    quantidade,
    data,
    isLiberado,
    impressoraIp = "45.227.182.222:9100",
    desabilitado,
  }: IRequest): Promise<PedidoBonificado> {
    try {
      const garrafao = await this.garrafaoRepository.getByClienteId(clienteId)
      const cliente = await this.clienteRepository.get(clienteId)

      if (!garrafao.data || garrafao.data.quantidade < quantidade) {
        throw new AppError("Quantidade de garrafões insuficiente")
      }

      const result = await this.pedidoBonificadoRepository
        .create({
          clienteId,
          quantidade,
          data,
          isLiberado,
          desabilitado,
        })
        .then((pedidoBonificadoResult) => {
          return pedidoBonificadoResult
        })
        .catch((error) => {
          return error
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
        printer.setTypeFontB()
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

      return result
    } catch (error) {
      return error
    }
  }
}

export { CreatePedidoBonificadoUseCase }
