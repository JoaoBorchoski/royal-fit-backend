import { Router } from 'express'
import { CreatePedidoController } from '@modules/pedido/use-cases/pedido/create-pedido/create-pedido-controller'
import { ListPedidoController } from '@modules/pedido/use-cases/pedido/list-pedido/list-pedido-controller'
import { CountPedidoController } from '@modules/pedido/use-cases/pedido/count-pedido/count-pedido-controller'
import { SelectPedidoController } from '@modules/pedido/use-cases/pedido/select-pedido/select-pedido-controller'
import { IdSelectPedidoController } from '@modules/pedido/use-cases/pedido/id-select-pedido/id-select-pedido-controller'
import { GetPedidoController } from '@modules/pedido/use-cases/pedido/get-pedido/get-pedido-controller'
import { UpdatePedidoController } from '@modules/pedido/use-cases/pedido/update-pedido/update-pedido-controller'
import { DeletePedidoController } from '@modules/pedido/use-cases/pedido/delete-pedido/delete-pedido-controller'
import { MultiDeletePedidoController } from '@modules/pedido/use-cases/pedido/multi-delete-pedido/multi-delete-pedido-controller'
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensure-authenticated'

const pedidosRoutes = Router()

const createPedidoController = new CreatePedidoController()
const listPedidoController = new ListPedidoController()
const countPedidoController = new CountPedidoController()
const selectPedidoController = new SelectPedidoController()
const idSelectPedidoController = new IdSelectPedidoController()
const getPedidoController = new GetPedidoController()
const updatePedidoController = new UpdatePedidoController()
const deletePedidoController = new DeletePedidoController()
const multiDeletePedidoController = new MultiDeletePedidoController()

pedidosRoutes.post('/', ensureAuthenticated, createPedidoController.handle)
pedidosRoutes.post('/list', ensureAuthenticated, listPedidoController.handle)
pedidosRoutes.post('/count', ensureAuthenticated, countPedidoController.handle)
pedidosRoutes.get('/select/:id', ensureAuthenticated, idSelectPedidoController.handle)
pedidosRoutes.get('/select', ensureAuthenticated, selectPedidoController.handle)
pedidosRoutes.get('/:id', ensureAuthenticated, getPedidoController.handle)
pedidosRoutes.put('/:id', ensureAuthenticated, updatePedidoController.handle)
pedidosRoutes.delete('/:id', ensureAuthenticated, deletePedidoController.handle)
pedidosRoutes.delete('/', ensureAuthenticated, multiDeletePedidoController.handle)

export { pedidosRoutes }
