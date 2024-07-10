import { Router } from 'express'
import { CreateStatusPagamentoController } from '@modules/cadastros/use-cases/status-pagamento/create-status-pagamento/create-status-pagamento-controller'
import { ListStatusPagamentoController } from '@modules/cadastros/use-cases/status-pagamento/list-status-pagamento/list-status-pagamento-controller'
import { CountStatusPagamentoController } from '@modules/cadastros/use-cases/status-pagamento/count-status-pagamento/count-status-pagamento-controller'
import { SelectStatusPagamentoController } from '@modules/cadastros/use-cases/status-pagamento/select-status-pagamento/select-status-pagamento-controller'
import { IdSelectStatusPagamentoController } from '@modules/cadastros/use-cases/status-pagamento/id-select-status-pagamento/id-select-status-pagamento-controller'
import { GetStatusPagamentoController } from '@modules/cadastros/use-cases/status-pagamento/get-status-pagamento/get-status-pagamento-controller'
import { UpdateStatusPagamentoController } from '@modules/cadastros/use-cases/status-pagamento/update-status-pagamento/update-status-pagamento-controller'
import { DeleteStatusPagamentoController } from '@modules/cadastros/use-cases/status-pagamento/delete-status-pagamento/delete-status-pagamento-controller'
import { MultiDeleteStatusPagamentoController } from '@modules/cadastros/use-cases/status-pagamento/multi-delete-status-pagamento/multi-delete-status-pagamento-controller'
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensure-authenticated'

const statusPagamentoRoutes = Router()

const createStatusPagamentoController = new CreateStatusPagamentoController()
const listStatusPagamentoController = new ListStatusPagamentoController()
const countStatusPagamentoController = new CountStatusPagamentoController()
const selectStatusPagamentoController = new SelectStatusPagamentoController()
const idSelectStatusPagamentoController = new IdSelectStatusPagamentoController()
const getStatusPagamentoController = new GetStatusPagamentoController()
const updateStatusPagamentoController = new UpdateStatusPagamentoController()
const deleteStatusPagamentoController = new DeleteStatusPagamentoController()
const multiDeleteStatusPagamentoController = new MultiDeleteStatusPagamentoController()

statusPagamentoRoutes.post('/', ensureAuthenticated, createStatusPagamentoController.handle)
statusPagamentoRoutes.post('/list', ensureAuthenticated, listStatusPagamentoController.handle)
statusPagamentoRoutes.post('/count', ensureAuthenticated, countStatusPagamentoController.handle)
statusPagamentoRoutes.get('/select/:id', ensureAuthenticated, idSelectStatusPagamentoController.handle)
statusPagamentoRoutes.get('/select', ensureAuthenticated, selectStatusPagamentoController.handle)
statusPagamentoRoutes.get('/:id', ensureAuthenticated, getStatusPagamentoController.handle)
statusPagamentoRoutes.put('/:id', ensureAuthenticated, updateStatusPagamentoController.handle)
statusPagamentoRoutes.delete('/:id', ensureAuthenticated, deleteStatusPagamentoController.handle)
statusPagamentoRoutes.delete('/', ensureAuthenticated, multiDeleteStatusPagamentoController.handle)

export { statusPagamentoRoutes }
