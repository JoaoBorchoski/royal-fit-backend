import { inject, injectable } from "tsyringe"
import { Caixa } from "@modules/financeiro/infra/typeorm/entities/caixa"
import { ICaixaRepository } from "@modules/financeiro/repositories/i-caixa-repository"
import { AppError } from "@shared/errors/app-error"
import { CharacterSet, PrinterTypes, ThermalPrinter } from "node-thermal-printer"
import { IPedidoRepository } from "@modules/pedido/repositories/i-pedido-repository"
import { IClienteRepository } from "@modules/cadastros/repositories/i-cliente-repository"
import { IMeioPagamentoRepository } from "@modules/cadastros/repositories/i-meio-pagamento-repository"

interface IRequest {
    descricao: string
    valor: number
    data: Date
    pedidoId: string
    clienteId: string
    formaPagamentoId: string
    impressoraIp?: string
}

@injectable()
class CreateCaixaUseCase {
    constructor(
        @inject("CaixaRepository")
        private caixaRepository: ICaixaRepository,
        @inject("PedidoRepository")
        private pedidoRepository: IPedidoRepository,
        @inject("ClienteRepository")
        private clienteRepository: IClienteRepository,
        @inject("MeioPagamentoRepository")
        private formaPagamentoRepository: IMeioPagamentoRepository
    ) {}

    async execute({ descricao, valor, data, pedidoId, clienteId, formaPagamentoId }: IRequest): Promise<Caixa> {
        const pedido = await this.pedidoRepository.get(pedidoId)
        const cliente = await this.clienteRepository.get(clienteId)
        const formaPagamento = await this.formaPagamentoRepository.get(formaPagamentoId)

        const result = await this.caixaRepository
            .create({
                descricao,
                valor,
                data,
                pedidoId,
                clienteId,
                formaPagamentoId,
            })
            .then((caixaResult) => {
                return caixaResult
            })
            .catch((error) => {
                return error
            })

        let printer = new ThermalPrinter({
            // type: "epson",
            type: PrinterTypes.EPSON,
            interface: `tcp://45.227.182.222:9100`,
            characterSet: CharacterSet.PC860_PORTUGUESE,
            options: {
                timeout: 5000,
            },
        })

        async function printReceipt() {
            printer.alignCenter()
            printer.setTypeFontB()
            printer.println("Royal Fit")
            printer.newLine()
            printer.drawLine()
            printer.newLine()
            printer.println(`Desc: ${descricao}`)
            printer.println(`Valor: R$ ${valor.toFixed(2)}`)
            printer.println(`Data: ${new Date(data).toLocaleDateString("pt-BR")}`)
            pedidoId && printer.println(`Pedido: ${pedido.data.sequencial}`)
            clienteId && printer.println(`Cliente: ${cliente.data.nome}`)
            formaPagamentoId && printer.println(`Forma de Pagamento: ${formaPagamento.data.nome}`)
            printer.newLine()
            printer.drawLine()
            printer.newLine()
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
    }
}

export { CreateCaixaUseCase }
