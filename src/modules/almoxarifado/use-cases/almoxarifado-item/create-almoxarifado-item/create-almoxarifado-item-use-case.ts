import { inject, injectable } from "tsyringe"
import { AlmoxarifadoItem } from "@modules/almoxarifado/infra/typeorm/entities/almoxarifado-item"
import { IAlmoxarifadoItemRepository } from "@modules/almoxarifado/repositories/i-almoxarifado-item-repository"
import { AppError } from "@shared/errors/app-error"
import nodemailer from "nodemailer"
import { sendMail } from "@shared/infra/http/app"
// import { io } from "@shared/infra/http/server"

interface IRequest {
  item: string
  quantidade: number
  quantidadeMin: number
  desabilitado: boolean
}

@injectable()
class CreateAlmoxarifadoItemUseCase {
  constructor(
    @inject("AlmoxarifadoItemRepository")
    private almoxarifadoItemRepository: IAlmoxarifadoItemRepository
  ) {}

  async execute({ item, quantidade, quantidadeMin, desabilitado }: IRequest): Promise<AlmoxarifadoItem> {
    const result = await this.almoxarifadoItemRepository
      .create({
        item,
        quantidade,
        quantidadeMin,
        desabilitado,
      })
      .then((almoxarifadoItemResult) => {
        return almoxarifadoItemResult
      })
      .catch((error) => {
        return error
      })

    if (quantidade < quantidadeMin) {
      // io.emit("alertaAlmoxarifado", `Estoque de almoxarifado abaixo do mínimo para o item: ${item}`)

      sendMail(
        "Estoque de almoxarifado abaixo do mínimo",
        `<p style='color: black'>Estoque de almoxarifado abaixo do mínimo para o seguinte item:</p>
         <ul style='border: 1.5px solid #bbbbbb; border-radius: 8px; padding: 8px; font-weight: bold;'>
           <li>Item: ${item}</li>
           <li>Quantidade atual em estoque: ${quantidade}</li>
           <li>Quantidade mínima configurada: ${quantidadeMin}</li>
         </ul>`
      )
    }

    return result
  }
}

export { CreateAlmoxarifadoItemUseCase }
