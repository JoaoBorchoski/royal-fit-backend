import { Router } from 'express'
import { CreatePedidoItemController } from '@modules/pedido/use-cases/pedido-item/create-pedido-item/create-pedido-item-controller'
import { ListPedidoItemController } from '@modules/pedido/use-cases/pedido-item/list-pedido-item/list-pedido-item-controller'
import { CountPedidoItemController } from '@modules/pedido/use-cases/pedido-item/count-pedido-item/count-pedido-item-controller'
import { SelectPedidoItemController } from '@modules/pedido/use-cases/pedido-item/select-pedido-item/select-pedido-item-controller'
import { IdSelectPedidoItemController } from '@modules/pedido/use-cases/pedido-item/id-select-pedido-item/id-select-pedido-item-controller'
import { GetPedidoItemController } from '@modules/pedido/use-cases/pedido-item/get-pedido-item/get-pedido-item-controller'
import { UpdatePedidoItemController } from '@modules/pedido/use-cases/pedido-item/update-pedido-item/update-pedido-item-controller'
import { DeletePedidoItemController } from '@modules/pedido/use-cases/pedido-item/delete-pedido-item/delete-pedido-item-controller'
import { MultiDeletePedidoItemController } from '@modules/pedido/use-cases/pedido-item/multi-delete-pedido-item/multi-delete-pedido-item-controller'
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensure-authenticated'

const pedidoItensRoutes = Router()

const createPedidoItemController = new CreatePedidoItemController()
const listPedidoItemController = new ListPedidoItemController()
const countPedidoItemController = new CountPedidoItemController()
const selectPedidoItemController = new SelectPedidoItemController()
const idSelectPedidoItemController = new IdSelectPedidoItemController()
const getPedidoItemController = new GetPedidoItemController()
const updatePedidoItemController = new UpdatePedidoItemController()
const deletePedidoItemController = new DeletePedidoItemController()
const multiDeletePedidoItemController = new MultiDeletePedidoItemController()

pedidoItensRoutes.post('/', ensureAuthenticated, createPedidoItemController.handle)
pedidoItensRoutes.post('/list', ensureAuthenticated, listPedidoItemController.handle)
pedidoItensRoutes.post('/count', ensureAuthenticated, countPedidoItemController.handle)
pedidoItensRoutes.get('/select/:id', ensureAuthenticated, idSelectPedidoItemController.handle)
pedidoItensRoutes.get('/select', ensureAuthenticated, selectPedidoItemController.handle)
pedidoItensRoutes.get('/:id', ensureAuthenticated, getPedidoItemController.handle)
pedidoItensRoutes.put('/:id', ensureAuthenticated, updatePedidoItemController.handle)
pedidoItensRoutes.delete('/:id', ensureAuthenticated, deletePedidoItemController.handle)
pedidoItensRoutes.delete('/', ensureAuthenticated, multiDeletePedidoItemController.handle)

export { pedidoItensRoutes }
