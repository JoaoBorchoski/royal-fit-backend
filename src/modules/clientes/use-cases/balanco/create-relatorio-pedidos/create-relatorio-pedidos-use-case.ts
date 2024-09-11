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
      const dataInicioFormatada = new Date(new Date(dataInicio).setDate(new Date(dataInicio).getDate() - 1))
      const dataFimFormatada = new Date(new Date(dataFim).setDate(new Date(dataFim).getDate() + 1))

      if (dataInicioFormatada > dataFimFormatada) {
        throw new AppError("Data de início não pode ser maior que a data de fim")
      }

      const pedidos = await this.pedidoRepository.getPedidosByDataAndCliente(dataInicioFormatada, dataFimFormatada, clienteId)

      console.log(pedidos.data)

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
    workbook.Sheets[sheetName]["!cols"] = [
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 150 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 160 },
      { wpx: 100 },
    ]
  }

  private exportEmptyExcel(sheetName: string) {
    const header = [
      "Pedido",
      "Data",
      "Valor Total Pedido (R$)",
      "Funcionário",
      "Produto",
      "Valor Unitário (R$)",
      "Quantidade",
      "Valor (R$)",
    ]

    const emptyData = [header]

    const ws = XLSX.utils.aoa_to_sheet(emptyData)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, ws, sheetName)

    return workbook
  }

  private async addDataToSheet(workbook: any, sheetName: string, data: any) {
    const dataForExcel = []
    const valorTotalPedidos = data.reduce((acc: number, item: any) => acc + item.valorTotal, 0)
    for await (const item of data) {
      for await (const pedidoItem of item.pedidoItens) {
        dataForExcel.push([
          item.sequencial,
          item.data.toLocaleDateString("pt-BR"),
          item.valorTotal,
          item.funcionarioNome,
          pedidoItem.produtoNome,
          pedidoItem.preco,
          pedidoItem.quantidade,
          pedidoItem.valor,
        ])
      }
    }
    dataForExcel.push(["", "", "", "", "", "", "", ""])
    dataForExcel.push(["", "", "", "", "", "", "Valor Total do período", `R$ ${valorTotalPedidos}`])

    XLSX.utils.sheet_add_aoa(workbook.Sheets[sheetName], dataForExcel, { origin: -1 })
  }
}

export { CreateRelatorioPedidoUseCase }
