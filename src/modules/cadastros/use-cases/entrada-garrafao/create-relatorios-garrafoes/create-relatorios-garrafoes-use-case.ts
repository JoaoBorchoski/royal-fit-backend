import { inject, injectable } from "tsyringe"
import { AppError } from "@shared/errors/app-error"
import { IEntradaGarrafaoRepository } from "@modules/cadastros/repositories/i-entrada-garrafao-repository"
import { EntradaGarrafao } from "@modules/cadastros/infra/typeorm/entities/entrada-garrafao"
import { HttpResponse, ok, serverError } from "@shared/helpers"
import * as XLSX from "xlsx"

interface IRequest {
  clienteId: string
  quantidade: number
  isRoyalfit: boolean
  desabilitado: boolean
}

@injectable()
class CreateRelatorioGarrafaoUseCase {
  constructor(
    @inject("EntradaGarrafaoRepository")
    private entradaGarrafaoRepository: IEntradaGarrafaoRepository
  ) {}

  async execute({ clienteId, dataInicio, dataFim }): Promise<HttpResponse> {
    try {
      const dataInicioFormatada = new Date(new Date(dataInicio).setDate(new Date(dataInicio).getDate() - 1))
      const dataFimFormatada = new Date(new Date(dataFim).setDate(new Date(dataFim).getDate() + 1))
      if (dataInicioFormatada > dataFimFormatada) {
        throw new AppError("Data de início não pode ser maior que a data de fim")
      }

      const entradas = await this.entradaGarrafaoRepository.getEntradasByDataAndCliente(dataInicioFormatada, dataFimFormatada, clienteId)

      const sheetName = "Sheet1"
      const emptyWorkbook = this.exportEmptyExcel(sheetName)
      await this.addDataToSheet(emptyWorkbook, sheetName, entradas.data)
      this.styleColumns(emptyWorkbook, sheetName)
      const wbout = XLSX.write(emptyWorkbook, { bookType: "xlsx", type: "binary" })
      return ok(wbout)
    } catch (error) {
      return serverError(error)
    }
  }

  private styleColumns(workbook: any, sheetName: string) {
    workbook.Sheets[sheetName]["!cols"] = [{ wpx: 100 }, { wpx: 100 }, { wpx: 100 }]
  }

  private exportEmptyExcel(sheetName: string) {
    const header = ["Data", "Quantidade", "Garrafão Royalfit"]

    const emptyData = [header]

    const ws = XLSX.utils.aoa_to_sheet(emptyData)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, ws, sheetName)

    return workbook
  }

  private async addDataToSheet(workbook: any, sheetName: string, data: any) {
    const dataForExcel = []
    for await (const item of data) {
      // dataForExcel.push([item.data.toLocaleDateString("pt-BR"), item.valorPago, item.meioPagamento, item.userName])
      dataForExcel.push([item.data.toLocaleDateString("pt-BR"), item.quantidade, item.isRoyalfit ? "Sim" : "Não"])
    }

    XLSX.utils.sheet_add_aoa(workbook.Sheets[sheetName], dataForExcel, { origin: -1 })
  }
}

export { CreateRelatorioGarrafaoUseCase }
