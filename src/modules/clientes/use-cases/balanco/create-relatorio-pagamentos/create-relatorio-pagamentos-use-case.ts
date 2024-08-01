import { inject, injectable } from "tsyringe"
import { IRelatorioFuncionarioRepository } from "@modules/relatorios/repositories/i-relatorio-funcionario-repository"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse, noContent, ok } from "@shared/helpers"
import * as XLSX from "xlsx"
import { IPedidoRepository } from "@modules/pedido/repositories/i-pedido-repository"
import { IPagamentoRepository } from "@modules/clientes/repositories/i-pagamento-repository"

interface IRequest {
  clienteId: string
  dataInicio: Date
  dataFim: Date
}

@injectable()
class CreateRelatorioPagamentoUseCase {
  constructor(
    @inject("PagamentoRepository")
    private pagamentoRepository: IPagamentoRepository
  ) {}

  async execute({ clienteId, dataInicio, dataFim }: IRequest): Promise<HttpResponse> {
    try {
      const dataInicioFormatada = new Date(new Date(dataInicio).setDate(new Date(dataInicio).getDate() - 1))
      const dataFimFormatada = new Date(new Date(dataFim).setDate(new Date(dataFim).getDate() + 1))

      if (dataInicioFormatada > dataFimFormatada) {
        throw new AppError("Data de início não pode ser maior que a data de fim")
      }

      const pagamentos = await this.pagamentoRepository.getPagamentosByDataAndCliente(
        dataInicioFormatada,
        dataFimFormatada,
        clienteId
      )

      const sheetName = "Sheet1"
      const emptyWorkbook = this.exportEmptyExcel(sheetName)
      await this.addDataToSheet(emptyWorkbook, sheetName, pagamentos.data)
      this.styleColumns(emptyWorkbook, sheetName)
      const wbout = XLSX.write(emptyWorkbook, { bookType: "xlsx", type: "binary" })
      return ok(wbout)
    } catch (error) {
      return error
    }
  }
  private styleColumns(workbook: any, sheetName: string) {
    workbook.Sheets[sheetName]["!cols"] = [{ wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }]
  }

  private exportEmptyExcel(sheetName: string) {
    const header = ["Data", "Valor Pago (R$)", "Meio de Pagamento", "Recebido por"]

    const emptyData = [header]

    const ws = XLSX.utils.aoa_to_sheet(emptyData)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, ws, sheetName)

    return workbook
  }

  private async addDataToSheet(workbook: any, sheetName: string, data: any) {
    const dataForExcel = []
    for await (const item of data) {
      dataForExcel.push([item.data.toLocaleDateString("pt-BR"), item.valorPago, item.meioPagamento, item.userName])
    }

    XLSX.utils.sheet_add_aoa(workbook.Sheets[sheetName], dataForExcel, { origin: -1 })
  }
}

export { CreateRelatorioPagamentoUseCase }
