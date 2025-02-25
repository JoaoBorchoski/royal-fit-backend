import { Router } from 'express'
import { CreateCaixaController } from '@modules/financeiro/use-cases/caixa/create-caixa/create-caixa-controller'
import { ListCaixaController } from '@modules/financeiro/use-cases/caixa/list-caixa/list-caixa-controller'
import { CountCaixaController } from '@modules/financeiro/use-cases/caixa/count-caixa/count-caixa-controller'
import { SelectCaixaController } from '@modules/financeiro/use-cases/caixa/select-caixa/select-caixa-controller'
import { IdSelectCaixaController } from '@modules/financeiro/use-cases/caixa/id-select-caixa/id-select-caixa-controller'
import { GetCaixaController } from '@modules/financeiro/use-cases/caixa/get-caixa/get-caixa-controller'
import { UpdateCaixaController } from '@modules/financeiro/use-cases/caixa/update-caixa/update-caixa-controller'
import { DeleteCaixaController } from '@modules/financeiro/use-cases/caixa/delete-caixa/delete-caixa-controller'
import { MultiDeleteCaixaController } from '@modules/financeiro/use-cases/caixa/multi-delete-caixa/multi-delete-caixa-controller'
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensure-authenticated'

const caixasRoutes = Router()

const createCaixaController = new CreateCaixaController()
const listCaixaController = new ListCaixaController()
const countCaixaController = new CountCaixaController()
const selectCaixaController = new SelectCaixaController()
const idSelectCaixaController = new IdSelectCaixaController()
const getCaixaController = new GetCaixaController()
const updateCaixaController = new UpdateCaixaController()
const deleteCaixaController = new DeleteCaixaController()
const multiDeleteCaixaController = new MultiDeleteCaixaController()

caixasRoutes.post('/', ensureAuthenticated, createCaixaController.handle)
caixasRoutes.post('/list', ensureAuthenticated, listCaixaController.handle)
caixasRoutes.post('/count', ensureAuthenticated, countCaixaController.handle)
caixasRoutes.get('/select/:id', ensureAuthenticated, idSelectCaixaController.handle)
caixasRoutes.get('/select', ensureAuthenticated, selectCaixaController.handle)
caixasRoutes.get('/:id', ensureAuthenticated, getCaixaController.handle)
caixasRoutes.put('/:id', ensureAuthenticated, updateCaixaController.handle)
caixasRoutes.delete('/:id', ensureAuthenticated, deleteCaixaController.handle)
caixasRoutes.delete('/', ensureAuthenticated, multiDeleteCaixaController.handle)

export { caixasRoutes }
