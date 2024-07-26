import { Router } from 'express'
import { CreatePedidoBonificadoController } from '@modules/pedido/use-cases/pedido-bonificado/create-pedido-bonificado/create-pedido-bonificado-controller'
import { ListPedidoBonificadoController } from '@modules/pedido/use-cases/pedido-bonificado/list-pedido-bonificado/list-pedido-bonificado-controller'
import { CountPedidoBonificadoController } from '@modules/pedido/use-cases/pedido-bonificado/count-pedido-bonificado/count-pedido-bonificado-controller'
import { SelectPedidoBonificadoController } from '@modules/pedido/use-cases/pedido-bonificado/select-pedido-bonificado/select-pedido-bonificado-controller'
import { IdSelectPedidoBonificadoController } from '@modules/pedido/use-cases/pedido-bonificado/id-select-pedido-bonificado/id-select-pedido-bonificado-controller'
import { GetPedidoBonificadoController } from '@modules/pedido/use-cases/pedido-bonificado/get-pedido-bonificado/get-pedido-bonificado-controller'
import { UpdatePedidoBonificadoController } from '@modules/pedido/use-cases/pedido-bonificado/update-pedido-bonificado/update-pedido-bonificado-controller'
import { DeletePedidoBonificadoController } from '@modules/pedido/use-cases/pedido-bonificado/delete-pedido-bonificado/delete-pedido-bonificado-controller'
import { MultiDeletePedidoBonificadoController } from '@modules/pedido/use-cases/pedido-bonificado/multi-delete-pedido-bonificado/multi-delete-pedido-bonificado-controller'
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensure-authenticated'

const pedidoBonificadosRoutes = Router()

const createPedidoBonificadoController = new CreatePedidoBonificadoController()
const listPedidoBonificadoController = new ListPedidoBonificadoController()
const countPedidoBonificadoController = new CountPedidoBonificadoController()
const selectPedidoBonificadoController = new SelectPedidoBonificadoController()
const idSelectPedidoBonificadoController = new IdSelectPedidoBonificadoController()
const getPedidoBonificadoController = new GetPedidoBonificadoController()
const updatePedidoBonificadoController = new UpdatePedidoBonificadoController()
const deletePedidoBonificadoController = new DeletePedidoBonificadoController()
const multiDeletePedidoBonificadoController = new MultiDeletePedidoBonificadoController()

pedidoBonificadosRoutes.post('/', ensureAuthenticated, createPedidoBonificadoController.handle)
pedidoBonificadosRoutes.post('/list', ensureAuthenticated, listPedidoBonificadoController.handle)
pedidoBonificadosRoutes.post('/count', ensureAuthenticated, countPedidoBonificadoController.handle)
pedidoBonificadosRoutes.get('/select/:id', ensureAuthenticated, idSelectPedidoBonificadoController.handle)
pedidoBonificadosRoutes.get('/select', ensureAuthenticated, selectPedidoBonificadoController.handle)
pedidoBonificadosRoutes.get('/:id', ensureAuthenticated, getPedidoBonificadoController.handle)
pedidoBonificadosRoutes.put('/:id', ensureAuthenticated, updatePedidoBonificadoController.handle)
pedidoBonificadosRoutes.delete('/:id', ensureAuthenticated, deletePedidoBonificadoController.handle)
pedidoBonificadosRoutes.delete('/', ensureAuthenticated, multiDeletePedidoBonificadoController.handle)

export { pedidoBonificadosRoutes }
