import { IPedidoRepository } from "@modules/pedido/repositories/i-pedido-repository"
import { inject, injectable } from "tsyringe"
import { ControleDespesa } from "@modules/financeiro/infra/typeorm/entities/controle-despesa"
import { IControleDespesaRepository } from "@modules/financeiro/repositories/i-controle-despesa-repository"
import { AppError } from "@shared/errors/app-error"
import { CharacterSet, PrinterTypes, ThermalPrinter } from "node-thermal-printer"
import { IClienteRepository } from "@modules/cadastros/repositories/i-cliente-repository"
import { IMeioPagamentoRepository } from "@modules/cadastros/repositories/i-meio-pagamento-repository"

interface IRequest {
    dataEmissao: Date
    dataVencimento: Date
    descricao: string
    valor: number
    status: number
    categoria: string
    codigoBarras: string
    pedidoId: string
    clienteId: string
    formaPagamentoId: string
}

@injectable()
class CreateControleDespesaUseCase {
    constructor(
        @inject("ControleDespesaRepository")
        private controleDespesaRepository: IControleDespesaRepository,
        @inject("PedidoRepository")
        private pedidoRepository: IPedidoRepository,
        @inject("ClienteRepository")
        private clienteRepository: IClienteRepository,
        @inject("MeioPagamentoRepository")
        private formaPagamentoRepository: IMeioPagamentoRepository
    ) {}

    async execute({
        dataEmissao,
        dataVencimento,
        descricao,
        valor,
        status,
        categoria,
        codigoBarras,
        pedidoId,
        clienteId,
        formaPagamentoId,
    }: IRequest): Promise<ControleDespesa> {
        const formaPagamento = await this.formaPagamentoRepository.get(formaPagamentoId)

        const result = await this.controleDespesaRepository
            .create({
                dataEmissao,
                dataVencimento,
                descricao,
                valor,
                status,
                categoria,
                codigoBarras,
                pedidoId,
                clienteId,
                formaPagamentoId,
            })
            .then((controleDespesaResult) => {
                return controleDespesaResult
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
            descricao && printer.println(`Desc: ${descricao}`)
            printer.println(`Valor: R$ ${valor.toFixed(2)}`)
            printer.println(`Data Emissao: ${new Date(dataEmissao).toLocaleDateString("pt-BR")}`)
            printer.println(`Data Vencimento: ${new Date(dataVencimento).toLocaleDateString("pt-BR")}`)
            codigoBarras && printer.println(`Codigo de Barras: ${codigoBarras}`)
            printer.println(`Status: ${status === 0 ? "Pendente" : status === 1 ? "Pago" : "Cancelado"}`)
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

export { CreateControleDespesaUseCase }
