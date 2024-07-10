import { Router } from 'express'
import { CreateMeioPagamentoController } from '@modules/cadastros/use-cases/meio-pagamento/create-meio-pagamento/create-meio-pagamento-controller'
import { ListMeioPagamentoController } from '@modules/cadastros/use-cases/meio-pagamento/list-meio-pagamento/list-meio-pagamento-controller'
import { CountMeioPagamentoController } from '@modules/cadastros/use-cases/meio-pagamento/count-meio-pagamento/count-meio-pagamento-controller'
import { SelectMeioPagamentoController } from '@modules/cadastros/use-cases/meio-pagamento/select-meio-pagamento/select-meio-pagamento-controller'
import { IdSelectMeioPagamentoController } from '@modules/cadastros/use-cases/meio-pagamento/id-select-meio-pagamento/id-select-meio-pagamento-controller'
import { GetMeioPagamentoController } from '@modules/cadastros/use-cases/meio-pagamento/get-meio-pagamento/get-meio-pagamento-controller'
import { UpdateMeioPagamentoController } from '@modules/cadastros/use-cases/meio-pagamento/update-meio-pagamento/update-meio-pagamento-controller'
import { DeleteMeioPagamentoController } from '@modules/cadastros/use-cases/meio-pagamento/delete-meio-pagamento/delete-meio-pagamento-controller'
import { MultiDeleteMeioPagamentoController } from '@modules/cadastros/use-cases/meio-pagamento/multi-delete-meio-pagamento/multi-delete-meio-pagamento-controller'
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensure-authenticated'

const meiosPagamentoRoutes = Router()

const createMeioPagamentoController = new CreateMeioPagamentoController()
const listMeioPagamentoController = new ListMeioPagamentoController()
const countMeioPagamentoController = new CountMeioPagamentoController()
const selectMeioPagamentoController = new SelectMeioPagamentoController()
const idSelectMeioPagamentoController = new IdSelectMeioPagamentoController()
const getMeioPagamentoController = new GetMeioPagamentoController()
const updateMeioPagamentoController = new UpdateMeioPagamentoController()
const deleteMeioPagamentoController = new DeleteMeioPagamentoController()
const multiDeleteMeioPagamentoController = new MultiDeleteMeioPagamentoController()

meiosPagamentoRoutes.post('/', ensureAuthenticated, createMeioPagamentoController.handle)
meiosPagamentoRoutes.post('/list', ensureAuthenticated, listMeioPagamentoController.handle)
meiosPagamentoRoutes.post('/count', ensureAuthenticated, countMeioPagamentoController.handle)
meiosPagamentoRoutes.get('/select/:id', ensureAuthenticated, idSelectMeioPagamentoController.handle)
meiosPagamentoRoutes.get('/select', ensureAuthenticated, selectMeioPagamentoController.handle)
meiosPagamentoRoutes.get('/:id', ensureAuthenticated, getMeioPagamentoController.handle)
meiosPagamentoRoutes.put('/:id', ensureAuthenticated, updateMeioPagamentoController.handle)
meiosPagamentoRoutes.delete('/:id', ensureAuthenticated, deleteMeioPagamentoController.handle)
meiosPagamentoRoutes.delete('/', ensureAuthenticated, multiDeleteMeioPagamentoController.handle)

export { meiosPagamentoRoutes }
