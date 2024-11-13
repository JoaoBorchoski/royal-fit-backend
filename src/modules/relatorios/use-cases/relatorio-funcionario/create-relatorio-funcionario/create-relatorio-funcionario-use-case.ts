import { inject, injectable } from "tsyringe"
import { IRelatorioFuncionarioRepository } from "@modules/relatorios/repositories/i-relatorio-funcionario-repository"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse, noContent, ok } from "@shared/helpers"
import * as XLSX from "xlsx"

interface IRequest {
  dataInicio: Date
  dataFim: Date
}

@injectable()
class CreateRelatorioFuncionarioUseCase {
  constructor(
    @inject("RelatorioFuncionarioRepository")
    private relatorioFuncionarioRepository: IRelatorioFuncionarioRepository
  ) {}

  async execute({ dataInicio, dataFim }: IRequest): Promise<HttpResponse> {
    try {
      const dataFimFormatada = new Date(dataFim)
      const dataInicioFormatada = new Date(dataInicio)
      // dataFimFormatada.setHours(23, 59, 59, 999)

      if (dataInicioFormatada > dataFimFormatada) {
        throw new AppError("Data de início não pode ser maior que a data de fim")
      }
      const pedidos = await this.relatorioFuncionarioRepository.getPedidosByData(dataInicio, dataFim)

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
    workbook.Sheets[sheetName]["!cols"] = [{ wpx: 100 }, { wpx: 100 }]
  }

  private exportEmptyExcel(sheetName: string) {
    const header = ["Funcionário", "Valor Total (R$)"]

    const emptyData = [header]

    const ws = XLSX.utils.aoa_to_sheet(emptyData)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, ws, sheetName)

    return workbook
  }

  private async addDataToSheet(workbook: any, sheetName: string, data: any) {
    const dataForExcel = []
    let valorTotal = 0
    for await (const item of data) {
      dataForExcel.push([item.pedidos[0].funcionarioNome, item.pedidos.reduce((acc, curr) => acc + curr.valorTotal, 0)])
      valorTotal += item.pedidos.reduce((acc, curr) => acc + curr.valorTotal, 0)
    }

    dataForExcel.push(["Total", valorTotal])

    XLSX.utils.sheet_add_aoa(workbook.Sheets[sheetName], dataForExcel, { origin: -1 })
  }
}

export { CreateRelatorioFuncionarioUseCase }
