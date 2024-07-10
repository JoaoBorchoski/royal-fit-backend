import { Router } from 'express'
import { CreateBalancoController } from '@modules/clientes/use-cases/balanco/create-balanco/create-balanco-controller'
import { ListBalancoController } from '@modules/clientes/use-cases/balanco/list-balanco/list-balanco-controller'
import { CountBalancoController } from '@modules/clientes/use-cases/balanco/count-balanco/count-balanco-controller'
import { SelectBalancoController } from '@modules/clientes/use-cases/balanco/select-balanco/select-balanco-controller'
import { IdSelectBalancoController } from '@modules/clientes/use-cases/balanco/id-select-balanco/id-select-balanco-controller'
import { GetBalancoController } from '@modules/clientes/use-cases/balanco/get-balanco/get-balanco-controller'
import { UpdateBalancoController } from '@modules/clientes/use-cases/balanco/update-balanco/update-balanco-controller'
import { DeleteBalancoController } from '@modules/clientes/use-cases/balanco/delete-balanco/delete-balanco-controller'
import { MultiDeleteBalancoController } from '@modules/clientes/use-cases/balanco/multi-delete-balanco/multi-delete-balanco-controller'
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensure-authenticated'

const balancosRoutes = Router()

const createBalancoController = new CreateBalancoController()
const listBalancoController = new ListBalancoController()
const countBalancoController = new CountBalancoController()
const selectBalancoController = new SelectBalancoController()
const idSelectBalancoController = new IdSelectBalancoController()
const getBalancoController = new GetBalancoController()
const updateBalancoController = new UpdateBalancoController()
const deleteBalancoController = new DeleteBalancoController()
const multiDeleteBalancoController = new MultiDeleteBalancoController()

balancosRoutes.post('/', ensureAuthenticated, createBalancoController.handle)
balancosRoutes.post('/list', ensureAuthenticated, listBalancoController.handle)
balancosRoutes.post('/count', ensureAuthenticated, countBalancoController.handle)
balancosRoutes.get('/select/:id', ensureAuthenticated, idSelectBalancoController.handle)
balancosRoutes.get('/select', ensureAuthenticated, selectBalancoController.handle)
balancosRoutes.get('/:id', ensureAuthenticated, getBalancoController.handle)
balancosRoutes.put('/:id', ensureAuthenticated, updateBalancoController.handle)
balancosRoutes.delete('/:id', ensureAuthenticated, deleteBalancoController.handle)
balancosRoutes.delete('/', ensureAuthenticated, multiDeleteBalancoController.handle)

export { balancosRoutes }
