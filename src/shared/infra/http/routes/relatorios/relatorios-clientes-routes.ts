import { Router } from 'express'
import { CreateRelatorioClienteController } from '@modules/relatorios/use-cases/relatorio-cliente/create-relatorio-cliente/create-relatorio-cliente-controller'
import { ListRelatorioClienteController } from '@modules/relatorios/use-cases/relatorio-cliente/list-relatorio-cliente/list-relatorio-cliente-controller'
import { CountRelatorioClienteController } from '@modules/relatorios/use-cases/relatorio-cliente/count-relatorio-cliente/count-relatorio-cliente-controller'
import { SelectRelatorioClienteController } from '@modules/relatorios/use-cases/relatorio-cliente/select-relatorio-cliente/select-relatorio-cliente-controller'
import { IdSelectRelatorioClienteController } from '@modules/relatorios/use-cases/relatorio-cliente/id-select-relatorio-cliente/id-select-relatorio-cliente-controller'
import { GetRelatorioClienteController } from '@modules/relatorios/use-cases/relatorio-cliente/get-relatorio-cliente/get-relatorio-cliente-controller'
import { UpdateRelatorioClienteController } from '@modules/relatorios/use-cases/relatorio-cliente/update-relatorio-cliente/update-relatorio-cliente-controller'
import { DeleteRelatorioClienteController } from '@modules/relatorios/use-cases/relatorio-cliente/delete-relatorio-cliente/delete-relatorio-cliente-controller'
import { MultiDeleteRelatorioClienteController } from '@modules/relatorios/use-cases/relatorio-cliente/multi-delete-relatorio-cliente/multi-delete-relatorio-cliente-controller'
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensure-authenticated'

const relatoriosClientesRoutes = Router()

const createRelatorioClienteController = new CreateRelatorioClienteController()
const listRelatorioClienteController = new ListRelatorioClienteController()
const countRelatorioClienteController = new CountRelatorioClienteController()
const selectRelatorioClienteController = new SelectRelatorioClienteController()
const idSelectRelatorioClienteController = new IdSelectRelatorioClienteController()
const getRelatorioClienteController = new GetRelatorioClienteController()
const updateRelatorioClienteController = new UpdateRelatorioClienteController()
const deleteRelatorioClienteController = new DeleteRelatorioClienteController()
const multiDeleteRelatorioClienteController = new MultiDeleteRelatorioClienteController()

relatoriosClientesRoutes.post('/', ensureAuthenticated, createRelatorioClienteController.handle)
relatoriosClientesRoutes.post('/list', ensureAuthenticated, listRelatorioClienteController.handle)
relatoriosClientesRoutes.post('/count', ensureAuthenticated, countRelatorioClienteController.handle)
relatoriosClientesRoutes.get('/select/:id', ensureAuthenticated, idSelectRelatorioClienteController.handle)
relatoriosClientesRoutes.get('/select', ensureAuthenticated, selectRelatorioClienteController.handle)
relatoriosClientesRoutes.get('/:id', ensureAuthenticated, getRelatorioClienteController.handle)
relatoriosClientesRoutes.put('/:id', ensureAuthenticated, updateRelatorioClienteController.handle)
relatoriosClientesRoutes.delete('/:id', ensureAuthenticated, deleteRelatorioClienteController.handle)
relatoriosClientesRoutes.delete('/', ensureAuthenticated, multiDeleteRelatorioClienteController.handle)

export { relatoriosClientesRoutes }
