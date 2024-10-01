import { Router } from 'express'
import { CreateDescontoController } from '@modules/clientes/use-cases/desconto/create-desconto/create-desconto-controller'
import { ListDescontoController } from '@modules/clientes/use-cases/desconto/list-desconto/list-desconto-controller'
import { CountDescontoController } from '@modules/clientes/use-cases/desconto/count-desconto/count-desconto-controller'
import { SelectDescontoController } from '@modules/clientes/use-cases/desconto/select-desconto/select-desconto-controller'
import { IdSelectDescontoController } from '@modules/clientes/use-cases/desconto/id-select-desconto/id-select-desconto-controller'
import { GetDescontoController } from '@modules/clientes/use-cases/desconto/get-desconto/get-desconto-controller'
import { UpdateDescontoController } from '@modules/clientes/use-cases/desconto/update-desconto/update-desconto-controller'
import { DeleteDescontoController } from '@modules/clientes/use-cases/desconto/delete-desconto/delete-desconto-controller'
import { MultiDeleteDescontoController } from '@modules/clientes/use-cases/desconto/multi-delete-desconto/multi-delete-desconto-controller'
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensure-authenticated'

const descontosRoutes = Router()

const createDescontoController = new CreateDescontoController()
const listDescontoController = new ListDescontoController()
const countDescontoController = new CountDescontoController()
const selectDescontoController = new SelectDescontoController()
const idSelectDescontoController = new IdSelectDescontoController()
const getDescontoController = new GetDescontoController()
const updateDescontoController = new UpdateDescontoController()
const deleteDescontoController = new DeleteDescontoController()
const multiDeleteDescontoController = new MultiDeleteDescontoController()

descontosRoutes.post('/', ensureAuthenticated, createDescontoController.handle)
descontosRoutes.post('/list', ensureAuthenticated, listDescontoController.handle)
descontosRoutes.post('/count', ensureAuthenticated, countDescontoController.handle)
descontosRoutes.get('/select/:id', ensureAuthenticated, idSelectDescontoController.handle)
descontosRoutes.get('/select', ensureAuthenticated, selectDescontoController.handle)
descontosRoutes.get('/:id', ensureAuthenticated, getDescontoController.handle)
descontosRoutes.put('/:id', ensureAuthenticated, updateDescontoController.handle)
descontosRoutes.delete('/:id', ensureAuthenticated, deleteDescontoController.handle)
descontosRoutes.delete('/', ensureAuthenticated, multiDeleteDescontoController.handle)

export { descontosRoutes }
