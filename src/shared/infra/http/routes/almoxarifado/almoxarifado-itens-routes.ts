import { Router } from 'express'
import { CreateAlmoxarifadoItemController } from '@modules/almoxarifado/use-cases/almoxarifado-item/create-almoxarifado-item/create-almoxarifado-item-controller'
import { ListAlmoxarifadoItemController } from '@modules/almoxarifado/use-cases/almoxarifado-item/list-almoxarifado-item/list-almoxarifado-item-controller'
import { CountAlmoxarifadoItemController } from '@modules/almoxarifado/use-cases/almoxarifado-item/count-almoxarifado-item/count-almoxarifado-item-controller'
import { SelectAlmoxarifadoItemController } from '@modules/almoxarifado/use-cases/almoxarifado-item/select-almoxarifado-item/select-almoxarifado-item-controller'
import { IdSelectAlmoxarifadoItemController } from '@modules/almoxarifado/use-cases/almoxarifado-item/id-select-almoxarifado-item/id-select-almoxarifado-item-controller'
import { GetAlmoxarifadoItemController } from '@modules/almoxarifado/use-cases/almoxarifado-item/get-almoxarifado-item/get-almoxarifado-item-controller'
import { UpdateAlmoxarifadoItemController } from '@modules/almoxarifado/use-cases/almoxarifado-item/update-almoxarifado-item/update-almoxarifado-item-controller'
import { DeleteAlmoxarifadoItemController } from '@modules/almoxarifado/use-cases/almoxarifado-item/delete-almoxarifado-item/delete-almoxarifado-item-controller'
import { MultiDeleteAlmoxarifadoItemController } from '@modules/almoxarifado/use-cases/almoxarifado-item/multi-delete-almoxarifado-item/multi-delete-almoxarifado-item-controller'
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensure-authenticated'

const almoxarifadoItensRoutes = Router()

const createAlmoxarifadoItemController = new CreateAlmoxarifadoItemController()
const listAlmoxarifadoItemController = new ListAlmoxarifadoItemController()
const countAlmoxarifadoItemController = new CountAlmoxarifadoItemController()
const selectAlmoxarifadoItemController = new SelectAlmoxarifadoItemController()
const idSelectAlmoxarifadoItemController = new IdSelectAlmoxarifadoItemController()
const getAlmoxarifadoItemController = new GetAlmoxarifadoItemController()
const updateAlmoxarifadoItemController = new UpdateAlmoxarifadoItemController()
const deleteAlmoxarifadoItemController = new DeleteAlmoxarifadoItemController()
const multiDeleteAlmoxarifadoItemController = new MultiDeleteAlmoxarifadoItemController()

almoxarifadoItensRoutes.post('/', ensureAuthenticated, createAlmoxarifadoItemController.handle)
almoxarifadoItensRoutes.post('/list', ensureAuthenticated, listAlmoxarifadoItemController.handle)
almoxarifadoItensRoutes.post('/count', ensureAuthenticated, countAlmoxarifadoItemController.handle)
almoxarifadoItensRoutes.get('/select/:id', ensureAuthenticated, idSelectAlmoxarifadoItemController.handle)
almoxarifadoItensRoutes.get('/select', ensureAuthenticated, selectAlmoxarifadoItemController.handle)
almoxarifadoItensRoutes.get('/:id', ensureAuthenticated, getAlmoxarifadoItemController.handle)
almoxarifadoItensRoutes.put('/:id', ensureAuthenticated, updateAlmoxarifadoItemController.handle)
almoxarifadoItensRoutes.delete('/:id', ensureAuthenticated, deleteAlmoxarifadoItemController.handle)
almoxarifadoItensRoutes.delete('/', ensureAuthenticated, multiDeleteAlmoxarifadoItemController.handle)

export { almoxarifadoItensRoutes }
