import { inject, injectable } from "tsyringe"
import { Fechamento } from "@modules/financeiro/infra/typeorm/entities/fechamento"
import { IFechamentoRepository } from "@modules/financeiro/repositories/i-fechamento-repository"
import { HttpResponse, ok } from "@shared/helpers"
import * as XLSX from "xlsx"

@injectable()
class GetFechamentoRelatorioUseCase {
  constructor(
    @inject("FechamentoRepository")
    private fechamentoRepository: IFechamentoRepository
  ) {}

  async execute(type: string, payload: any): Promise<HttpResponse> {
    try {
      if (!!payload) {
        const fechamentos = await this.fechamentoRepository.getFechamentoRelatorioDetalhado(type, payload)

        const sheetName = "Sheet1"

        switch (type) {
          case "periodo":
            const emptyWorkbook1 = this.exportEmptyExcel(sheetName)
            await this.addDataToSheet(emptyWorkbook1, sheetName, fechamentos)
            this.styleColumns(emptyWorkbook1, sheetName)
            const wbout1 = XLSX.write(emptyWorkbook1, { bookType: "xlsx", type: "binary" })
            return ok(wbout1)
          case "produto":
            const emptyWorkbook2 = this.exportEmptyExcelProduto(sheetName)
            await this.addDataToSheetProduto(emptyWorkbook2, sheetName, fechamentos)
            this.styleColumnsProduto(emptyWorkbook2, sheetName)
            const wbout2 = XLSX.write(emptyWorkbook2, { bookType: "xlsx", type: "binary" })
            return ok(wbout2)
          case "cliente":
            const emptyWorkbook3 = this.exportEmptyExcelCliente(sheetName)
            await this.addDataToSheetCliente(emptyWorkbook3, sheetName, fechamentos)
            this.styleColumnsCliente(emptyWorkbook3, sheetName)
            const wbout3 = XLSX.write(emptyWorkbook3, { bookType: "xlsx", type: "binary" })
            return ok(wbout3)
          default:
            break
        }
      }

      const fechamentos = await this.fechamentoRepository.getFechamentoRelatorio(type)

      const sheetName = "Sheet1"
      const emptyWorkbook = this.exportEmptyExcel(sheetName)
      await this.addDataToSheet(emptyWorkbook, sheetName, fechamentos)
      this.styleColumns(emptyWorkbook, sheetName)
      const wbout = XLSX.write(emptyWorkbook, { bookType: "xlsx", type: "binary" })
      return ok(wbout)
    } catch (error) {
      return error
    }
  }

  private styleColumns(workbook: any, sheetName: string) {
    workbook.Sheets[sheetName]["!cols"] = [{ wpx: 200 }, { wpx: 200 }, { wpx: 200 }, { wpx: 200 }]
  }

  private exportEmptyExcel(sheetName: string) {
    const header = ["Data", "Valor (R$)", "Descrição", "Meio de Pagamento"]

    const emptyData = [header]

    const ws = XLSX.utils.aoa_to_sheet(emptyData)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, ws, sheetName)

    return workbook
  }

  private exportEmptyExcelProduto(sheetName: string) {
    const header = ["Pedido", "Data", "Valor Total (R$)", "Quantidade", "Produto"]

    const emptyData = [header]

    const ws = XLSX.utils.aoa_to_sheet(emptyData)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, ws, sheetName)

    return workbook
  }

  private styleColumnsProduto(workbook: any, sheetName: string) {
    workbook.Sheets[sheetName]["!cols"] = [{ wpx: 200 }, { wpx: 200 }, { wpx: 200 }, { wpx: 200 }, { wpx: 200 }]
  }

  private exportEmptyExcelCliente(sheetName: string) {
    const header = ["Descrição", "Valor (R$)", "Data", "Meio Pagamento", "Cliente"]

    const emptyData = [header]

    const ws = XLSX.utils.aoa_to_sheet(emptyData)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, ws, sheetName)

    return workbook
  }

  private styleColumnsCliente(workbook: any, sheetName: string) {
    workbook.Sheets[sheetName]["!cols"] = [{ wpx: 200 }, { wpx: 200 }, { wpx: 200 }, { wpx: 200 }, { wpx: 200 }]
  }

  private async addDataToSheet(workbook: any, sheetName: string, data: any) {
    const dataForExcel = []

    dataForExcel.push(["", "", "", ""])

    dataForExcel.push([
      `Total Entradas: R$ ${data.caixa}`,
      `Total Despesas: R$ ${data.controle_despesas}`,
      "",
      "Fechamento: R$ " + parseFloat(data.fechamento).toFixed(2),
    ])

    dataForExcel.push(["", "", "", ""])

    dataForExcel.push(["ENTRADAS", "", "", ""])

    for await (const item of data.detalhes.entradas) {
      dataForExcel.push([item.data.toLocaleDateString(), `R$ ${parseFloat(item.valor).toFixed(2)}`, item.descricao, item.meio_pagamento])
    }

    dataForExcel.push(["", "", "TOTAL ENTRADAS (R$)", `R$ ${parseFloat(data.caixa).toFixed(2)}`])

    dataForExcel.push(["", "", "", ""])

    dataForExcel.push(["SAÍDAS", "", "", ""])

    for await (const item of data.detalhes.despesas) {
      dataForExcel.push([item.data.toLocaleDateString(), `R$ ${parseFloat(item.valor).toFixed(2)}`, item.descricao, item.meio_pagamento])
    }

    dataForExcel.push(["", "", "TOTAL DESPESAS (R$)", `R$ ${parseFloat(data.controle_despesas).toFixed(2)}`])

    XLSX.utils.sheet_add_aoa(workbook.Sheets[sheetName], dataForExcel, { origin: -1 })
  }

  private async addDataToSheetProduto(workbook: any, sheetName: string, data: any) {
    const dataForExcel = []

    data.forEach((item) => {
      dataForExcel.push([
        item.sequencial,
        item.data_pedido.toLocaleDateString(),
        `R$ ${parseFloat(item.valor).toFixed(2)}`,
        item.quantidade.toString(),
        item.produto,
      ])
    })

    XLSX.utils.sheet_add_aoa(workbook.Sheets[sheetName], dataForExcel, { origin: -1 })
  }

  private async addDataToSheetCliente(workbook: any, sheetName: string, data: any) {
    console.log(data)

    const dataForExcel = []

    data.forEach((item) => {
      dataForExcel.push([item.descricao, `R$ ${parseFloat(item.valor).toFixed(2)}`, item.data.toLocaleDateString(), item.meio_pagamento, item.cliente])
    })

    XLSX.utils.sheet_add_aoa(workbook.Sheets[sheetName], dataForExcel, { origin: -1 })
  }
}

export { GetFechamentoRelatorioUseCase }
