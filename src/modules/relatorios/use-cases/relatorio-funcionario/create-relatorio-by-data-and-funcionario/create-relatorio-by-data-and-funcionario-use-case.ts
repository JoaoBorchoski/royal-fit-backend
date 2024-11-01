import { inject, injectable } from "tsyringe"
import { IRelatorioFuncionarioRepository } from "@modules/relatorios/repositories/i-relatorio-funcionario-repository"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse, noContent, ok } from "@shared/helpers"
import * as XLSX from "xlsx"

interface IRequest {
  dataInicio: Date
  dataFim: Date
  id: string
}

@injectable()
class CreateRelatorioDataAndFuncionarioUseCase {
  constructor(
    @inject("RelatorioFuncionarioRepository")
    private relatorioFuncionarioRepository: IRelatorioFuncionarioRepository
  ) {}

  async execute({ dataInicio, dataFim, id }: IRequest): Promise<HttpResponse> {
    try {
      const dataInicioFormatada = new Date(new Date(dataInicio).setDate(new Date(dataInicio).getDate() - 1))
      const dataFimFormatada = new Date(new Date(dataFim).setDate(new Date(dataFim).getDate() + 1))

      if (dataInicioFormatada > dataFimFormatada) {
        throw new AppError("Data de início não pode ser maior que a data de fim")
      }

      const pedidos = await this.relatorioFuncionarioRepository.getPedidosByDataAndFuncionario(
        dataInicioFormatada,
        dataFimFormatada,
        id
      )

      const sheetName = "Sheet1"
      const emptyWorkbook = this.exportEmptyExcel(sheetName)
      await this.addDataToSheet(emptyWorkbook, sheetName, pedidos.data)
      this.styleColumns(emptyWorkbook, sheetName)
      const wbout = XLSX.write(emptyWorkbook, { bookType: "xlsx", type: "binary" })
      return ok(wbout)
    } catch (error) {
      console.log(error)
      return error
    }
  }
  private styleColumns(workbook: any, sheetName: string) {
    workbook.Sheets[sheetName]["!cols"] = [{ wpx: 100 }, { wpx: 100 }, { wpx: 100 }]
  }

  private exportEmptyExcel(sheetName: string) {
    const header = ["Cliente", "Data", "Valor Total (R$)"]

    const emptyData = [header]

    const ws = XLSX.utils.aoa_to_sheet(emptyData)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, ws, sheetName)

    return workbook
  }

  private async addDataToSheet(workbook: any, sheetName: string, data: any) {
    const dataForExcel = []

    for await (const item of data) {
      dataForExcel.push([item.clienteNome, item.data, item.valorTotal.toString().split("T")[0]])
    }

    XLSX.utils.sheet_add_aoa(workbook.Sheets[sheetName], dataForExcel, { origin: -1 })
  }
}

export { CreateRelatorioDataAndFuncionarioUseCase }
