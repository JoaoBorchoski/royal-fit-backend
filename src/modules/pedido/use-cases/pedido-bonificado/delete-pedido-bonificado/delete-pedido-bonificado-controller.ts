import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { DeletePedidoBonificadoUseCase } from './delete-pedido-bonificado-use-case'
import { ListPedidoBonificadoUseCase } from '../list-pedido-bonificado/list-pedido-bonificado-use-case'

class DeletePedidoBonificadoController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete record
    
    const id = request.params.id
    const deletePedidoBonificadoUseCase = container.resolve(DeletePedidoBonificadoUseCase)
    await deletePedidoBonificadoUseCase.execute(id)


    // restore list with updated records

    const listPedidoBonificadoUseCase = container.resolve(ListPedidoBonificadoUseCase)
    const pedidoBonificados = await listPedidoBonificadoUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(pedidoBonificados)
  }
}

export { DeletePedidoBonificadoController }
