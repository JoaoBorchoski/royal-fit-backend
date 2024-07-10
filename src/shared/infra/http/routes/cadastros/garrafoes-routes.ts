import { Router } from 'express'
import { CreateGarrafaoController } from '@modules/cadastros/use-cases/garrafao/create-garrafao/create-garrafao-controller'
import { ListGarrafaoController } from '@modules/cadastros/use-cases/garrafao/list-garrafao/list-garrafao-controller'
import { CountGarrafaoController } from '@modules/cadastros/use-cases/garrafao/count-garrafao/count-garrafao-controller'
import { SelectGarrafaoController } from '@modules/cadastros/use-cases/garrafao/select-garrafao/select-garrafao-controller'
import { IdSelectGarrafaoController } from '@modules/cadastros/use-cases/garrafao/id-select-garrafao/id-select-garrafao-controller'
import { GetGarrafaoController } from '@modules/cadastros/use-cases/garrafao/get-garrafao/get-garrafao-controller'
import { UpdateGarrafaoController } from '@modules/cadastros/use-cases/garrafao/update-garrafao/update-garrafao-controller'
import { DeleteGarrafaoController } from '@modules/cadastros/use-cases/garrafao/delete-garrafao/delete-garrafao-controller'
import { MultiDeleteGarrafaoController } from '@modules/cadastros/use-cases/garrafao/multi-delete-garrafao/multi-delete-garrafao-controller'
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensure-authenticated'

const garrafoesRoutes = Router()

const createGarrafaoController = new CreateGarrafaoController()
const listGarrafaoController = new ListGarrafaoController()
const countGarrafaoController = new CountGarrafaoController()
const selectGarrafaoController = new SelectGarrafaoController()
const idSelectGarrafaoController = new IdSelectGarrafaoController()
const getGarrafaoController = new GetGarrafaoController()
const updateGarrafaoController = new UpdateGarrafaoController()
const deleteGarrafaoController = new DeleteGarrafaoController()
const multiDeleteGarrafaoController = new MultiDeleteGarrafaoController()

garrafoesRoutes.post('/', ensureAuthenticated, createGarrafaoController.handle)
garrafoesRoutes.post('/list', ensureAuthenticated, listGarrafaoController.handle)
garrafoesRoutes.post('/count', ensureAuthenticated, countGarrafaoController.handle)
garrafoesRoutes.get('/select/:id', ensureAuthenticated, idSelectGarrafaoController.handle)
garrafoesRoutes.get('/select', ensureAuthenticated, selectGarrafaoController.handle)
garrafoesRoutes.get('/:id', ensureAuthenticated, getGarrafaoController.handle)
garrafoesRoutes.put('/:id', ensureAuthenticated, updateGarrafaoController.handle)
garrafoesRoutes.delete('/:id', ensureAuthenticated, deleteGarrafaoController.handle)
garrafoesRoutes.delete('/', ensureAuthenticated, multiDeleteGarrafaoController.handle)

export { garrafoesRoutes }
