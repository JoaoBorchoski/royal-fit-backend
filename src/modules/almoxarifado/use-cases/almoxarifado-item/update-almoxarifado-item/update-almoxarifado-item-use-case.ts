import { inject, injectable } from "tsyringe"
import { AlmoxarifadoItem } from "@modules/almoxarifado/infra/typeorm/entities/almoxarifado-item"
import { IAlmoxarifadoItemRepository } from "@modules/almoxarifado/repositories/i-almoxarifado-item-repository"
import { AppError } from "@shared/errors/app-error"
import { HttpResponse } from "@shared/helpers"
import { sendMail } from "@shared/infra/http/app"
// import { io } from "@shared/infra/http/server"

interface IRequest {
  id: string
  item: string
  quantidade: number
  quantidadeMin: number
  desabilitado: boolean
}

@injectable()
class UpdateAlmoxarifadoItemUseCase {
  constructor(
    @inject("AlmoxarifadoItemRepository")
    private almoxarifadoItemRepository: IAlmoxarifadoItemRepository
  ) {}

  async execute({ id, item, quantidade, quantidadeMin, desabilitado }: IRequest): Promise<HttpResponse> {
    const almoxarifadoItem = await this.almoxarifadoItemRepository.update({
      id,
      item,
      quantidade,
      quantidadeMin,
      desabilitado,
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

    return almoxarifadoItem
  }
}

export { UpdateAlmoxarifadoItemUseCase }
