import { inject, injectable } from "tsyringe"
import { IRelatorioFuncionarioRepository } from "@modules/relatorios/repositories/i-relatorio-funcionario-repository"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse, noContent, ok } from "@shared/helpers"
import * as XLSX from "xlsx"
import { IPedidoRepository } from "@modules/pedido/repositories/i-pedido-repository"

interface IRequest {
  clienteId: string
  dataInicio: Date
  dataFim: Date
}

@injectable()
class CreateRelatorioPedidoUseCase {
  constructor(
    @inject("PedidoRepository")
    private pedidoRepository: IPedidoRepository
  ) {}

  async execute({ clienteId, dataInicio, dataFim }: IRequest): Promise<HttpResponse> {
    try {
      const dataInicioFormatada = new Date(dataInicio)
      const dataFimFormatada = new Date(dataFim)

      if (dataInicioFormatada > dataFimFormatada) {
        throw new AppError("Data de início não pode ser maior que a data de fim")
      }

      const pedidos = await this.pedidoRepository.getPedidosByDataAndCliente(dataInicioFormatada, dataFimFormatada, clienteId)

      const sheetName = "Sheet1"
      const emptyWorkbook = this.exportEmptyExcel(sheetName)
      await this.addDataToSheet(emptyWorkbook, sheetName, pedidos.data)
      this.styleColumns(emptyWorkbook, sheetName)
      const wbout = XLSX.write(emptyWorkbook, { bookType: "xlsx", type: "binary" })
      return ok(wbout)
    } catch (error) {
      return error
    }
  }
  private styleColumns(workbook: any, sheetName: string) {
    workbook.Sheets[sheetName]["!cols"] = [{ wpx: 100 }, { wpx: 100 }, { wpx: 100 }]
  }

  private exportEmptyExcel(sheetName: string) {
    const header = ["Data", "Valor Total (R$)", "Funcionário"]

    const emptyData = [header]

    const ws = XLSX.utils.aoa_to_sheet(emptyData)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, ws, sheetName)

    return workbook
  }

  private async addDataToSheet(workbook: any, sheetName: string, data: any) {
    const dataForExcel = []
    for await (const item of data) {
      dataForExcel.push([item.data.toLocaleDateString("pt-BR"), item.valorTotal, item.funcionarioNome])
    }

    XLSX.utils.sheet_add_aoa(workbook.Sheets[sheetName], dataForExcel, { origin: -1 })
  }
}

export { CreateRelatorioPedidoUseCase }
