import { IClienteDTO } from "@modules/cadastros/dtos/i-cliente-dto"
import { IEstoqueDTO } from "@modules/cadastros/dtos/i-estoque-dto"
import { IFuncionarioDTO } from "@modules/cadastros/dtos/i-funcionario-dto"
import { IProdutoDTO } from "@modules/cadastros/dtos/i-produto-dto"
import { IClienteRepository } from "@modules/cadastros/repositories/i-cliente-repository"
import { IEstoqueRepository } from "@modules/cadastros/repositories/i-estoque-repository"
import { IFuncionarioRepository } from "@modules/cadastros/repositories/i-funcionario-repository"
import { IProdutoRepository } from "@modules/cadastros/repositories/i-produto-repository"
import { IPedidoDTO } from "@modules/pedido/dtos/i-pedido-dto"
import { IPedidoItemDTO } from "@modules/pedido/dtos/i-pedido-item-dto"
import { IPedidoItemRepository } from "@modules/pedido/repositories/i-pedido-item-repository"
import { IPedidoRepository } from "@modules/pedido/repositories/i-pedido-repository"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse, noContent, ok } from "@shared/helpers"
import fs from "fs"
import moment from "moment"
import { inject, injectable } from "tsyringe"
import { getConnection } from "typeorm"
import xlsx from "xlsx"
interface IRequest {
  file: Express.Multer.File
}

@injectable()
class ImportPedidoUseCase {
  constructor(
    @inject("ProdutoRepository")
    private produtoRepository: IProdutoRepository,
    @inject("PedidoRepository")
    private pedidoRepository: IPedidoRepository,
    @inject("PedidoItemRepository")
    private pedidoItemRepository: IPedidoItemRepository,
    @inject("ClienteRepository")
    private clienteRepository: IClienteRepository,
    @inject("FuncionarioRepository")
    private funcionarioRepository: IFuncionarioRepository
  ) {}

  async importExcelDataItem(row: any, pedidoId: string): Promise<IPedidoItemDTO> {
    const produto = await this.produtoRepository.getByname(row["produto"])

    if (!produto.data) {
      throw new AppError(`Arquivo com produtos não cadastrados, verificar.`)
    }

    const pedidoItem: IPedidoItemDTO = {
      produtoId: produto.data.id,
      pedidoId: pedidoId,
      quantidade: row["quantidade"],
    }

    return pedidoItem
  }

  async importExcelDataCab(row: any, queryRunner): Promise<IPedidoDTO> {
    const excelDateToJSDate = (serial: number) => {
      const utc_days = Math.floor(serial - 25569)
      const utc_value = utc_days * 86400
      const date_info = new Date(utc_value * 1000)

      if (!date_info.getTime()) {
        throw new AppError(`Arquivo com data inválida, verificar.`)
      }

      return date_info
    }

    const returnTrueOrFalse = (row: any) => {
      if (!row) {
        return false
      }
      if (typeof row === "boolean") {
        return row
      }
      if (row.toString().toLowerCase() === "sim") {
        return true
      }
      if (row.toString().toLowerCase() === "nao" || row.toString().toLowerCase() === "não") {
        return false
      }
    }

    const totalPedidos = await this.pedidoRepository.countWithQueryRunner("", "", queryRunner)
    const cliente = await this.clienteRepository.getByCpfCnpj(row["clienteCPF/CNPJ"].toString().replace(/[^\d]+/g, ""))
    const funcionario = await this.funcionarioRepository.getByCpf(row["funcionarioCPF"].toString().replace(/[^\d]+/g, ""))

    if (!cliente.data || !funcionario.data) {
      throw new AppError(`Arquivo com clientes e/ou funcionários não cadastrados, verificar.`)
    }

    const pedido: IPedidoDTO = {
      sequencial: totalPedidos.data.count + 1,
      data: excelDateToJSDate(row["data"]),
      hora: "1200",
      // valorTotal: Number(row["valorTotal"].toString().replace(/\./g, "").replace(/,/g, ".")),
      valorTotal: row["valorTotal"],
      clienteId: cliente.data.id,
      funcionarioId: funcionario.data.id,
      meioPagamentoId: "ea1fc3d7-2ec6-4a7e-8094-99a84131a2b8",
      statusPagamentoId: returnTrueOrFalse(row["pago"])
        ? "2798a92f-3412-4ed3-934d-e1209bbad87f"
        : "58922f62-67e4-4f50-8e0d-2bcb89f95f9a",
    }

    return pedido
  }

  private async parseExcelFile(file: Express.Multer.File): Promise<any[]> {
    return new Promise((resolve) => {
      const fileContent = fs.readFileSync(file.path)
      const workbook = xlsx.read(fileContent, { type: "buffer" })
      const sheetNames = workbook.SheetNames
      const excelData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]])

      resolve(excelData)
    })
  }

  async execute(request: IRequest): Promise<HttpResponse> {
    const { file } = request
    const queryRunner = getConnection().createQueryRunner()
    await queryRunner.startTransaction()

    let errors = []
    let pedidoSeparado = {}

    try {
      const rows = await this.parseExcelFile(file)

      for await (const row of rows) {
        if (!pedidoSeparado[row["pedido"]]) {
          pedidoSeparado[row["pedido"]] = []
        }
        pedidoSeparado[row["pedido"]].push(row)
      }

      for await (const pedido of Object.keys(pedidoSeparado)) {
        let lastPedido: number
        let pedidoId: string

        for await (const [index, row] of pedidoSeparado[pedido].entries()) {
          const cliente = await this.clienteRepository.getByCpfCnpj(row["clienteCPF/CNPJ"].toString().replace(/[^\d]+/g, ""))
          const funcionario = await this.funcionarioRepository.getByCpf(row["funcionarioCPF"].toString().replace(/[^\d]+/g, ""))

          if (!cliente.data || !funcionario.data) {
            throw new AppError(`Arquivo com clientes e/ou funcionários não cadastrados, verificar.`)
          }

          if (row.pedido != lastPedido) {
            lastPedido = row.pedido
            const pedidoCab = await this.importExcelDataCab(row, queryRunner.manager)
            const pedidoCabData = await this.pedidoRepository.createWithQueryRunner(pedidoCab, queryRunner.manager)
            pedidoId = pedidoCabData.data.id
          }

          const pedidoItem = await this.importExcelDataItem(row, pedidoId)
          await this.pedidoItemRepository.createWithQueryRunner(pedidoItem, queryRunner.manager)
        }
      }

      fs.unlinkSync(file.path)
      if (errors.length > 0) {
        await queryRunner.commitTransaction()
        return ok({
          warning: "Arquivo possui informações incorretas!\nConsultar aquivo para mais informações",
          errors: errors,
        })
      }
      await queryRunner.commitTransaction()
      return noContent()
    } catch (error) {
      console.log(error)
      fs.unlinkSync(file.path)
      await queryRunner.rollbackTransaction()
      return error
    } finally {
      await queryRunner.release()
    }
  }
}

export { ImportPedidoUseCase }
