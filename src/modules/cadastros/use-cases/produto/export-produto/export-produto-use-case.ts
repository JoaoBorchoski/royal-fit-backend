import * as XLSX from "xlsx"
import { ok, serverError } from "@shared/helpers"
import { inject, injectable } from "tsyringe"

@injectable()
class ExportProdutoExcelUseCase {
  constructor() {}

  async execute(): Promise<any> {
    const sheetName = "Sheet1"
    const emptyWorkbook = this.exportEmptyExcel(sheetName)
    this.styleColumns(emptyWorkbook, sheetName)
    const wbout = XLSX.write(emptyWorkbook, { bookType: "xlsx", type: "binary" })
    return ok(wbout)
  }

  private styleColumns(workbook: any, sheetName: string) {
    workbook.Sheets[sheetName]["!cols"] = [{ wpx: 150 }, { wpx: 150 }]
  }

  private exportEmptyExcel(sheetName: string) {
    const header = ["nome", "preco"]

    const emptyData = [header]

    const ws = XLSX.utils.aoa_to_sheet(emptyData)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, ws, sheetName)

    return workbook
  }
}

export { ExportProdutoExcelUseCase }
