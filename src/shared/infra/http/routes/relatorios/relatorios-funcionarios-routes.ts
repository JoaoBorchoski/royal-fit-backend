import { Router } from 'express'
import { CreateRelatorioFuncionarioController } from '@modules/relatorios/use-cases/relatorio-funcionario/create-relatorio-funcionario/create-relatorio-funcionario-controller'
import { ListRelatorioFuncionarioController } from '@modules/relatorios/use-cases/relatorio-funcionario/list-relatorio-funcionario/list-relatorio-funcionario-controller'
import { CountRelatorioFuncionarioController } from '@modules/relatorios/use-cases/relatorio-funcionario/count-relatorio-funcionario/count-relatorio-funcionario-controller'
import { SelectRelatorioFuncionarioController } from '@modules/relatorios/use-cases/relatorio-funcionario/select-relatorio-funcionario/select-relatorio-funcionario-controller'
import { IdSelectRelatorioFuncionarioController } from '@modules/relatorios/use-cases/relatorio-funcionario/id-select-relatorio-funcionario/id-select-relatorio-funcionario-controller'
import { GetRelatorioFuncionarioController } from '@modules/relatorios/use-cases/relatorio-funcionario/get-relatorio-funcionario/get-relatorio-funcionario-controller'
import { UpdateRelatorioFuncionarioController } from '@modules/relatorios/use-cases/relatorio-funcionario/update-relatorio-funcionario/update-relatorio-funcionario-controller'
import { DeleteRelatorioFuncionarioController } from '@modules/relatorios/use-cases/relatorio-funcionario/delete-relatorio-funcionario/delete-relatorio-funcionario-controller'
import { MultiDeleteRelatorioFuncionarioController } from '@modules/relatorios/use-cases/relatorio-funcionario/multi-delete-relatorio-funcionario/multi-delete-relatorio-funcionario-controller'
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensure-authenticated'

const relatoriosFuncionariosRoutes = Router()

const createRelatorioFuncionarioController = new CreateRelatorioFuncionarioController()
const listRelatorioFuncionarioController = new ListRelatorioFuncionarioController()
const countRelatorioFuncionarioController = new CountRelatorioFuncionarioController()
const selectRelatorioFuncionarioController = new SelectRelatorioFuncionarioController()
const idSelectRelatorioFuncionarioController = new IdSelectRelatorioFuncionarioController()
const getRelatorioFuncionarioController = new GetRelatorioFuncionarioController()
const updateRelatorioFuncionarioController = new UpdateRelatorioFuncionarioController()
const deleteRelatorioFuncionarioController = new DeleteRelatorioFuncionarioController()
const multiDeleteRelatorioFuncionarioController = new MultiDeleteRelatorioFuncionarioController()

relatoriosFuncionariosRoutes.post('/', ensureAuthenticated, createRelatorioFuncionarioController.handle)
relatoriosFuncionariosRoutes.post('/list', ensureAuthenticated, listRelatorioFuncionarioController.handle)
relatoriosFuncionariosRoutes.post('/count', ensureAuthenticated, countRelatorioFuncionarioController.handle)
relatoriosFuncionariosRoutes.get('/select/:id', ensureAuthenticated, idSelectRelatorioFuncionarioController.handle)
relatoriosFuncionariosRoutes.get('/select', ensureAuthenticated, selectRelatorioFuncionarioController.handle)
relatoriosFuncionariosRoutes.get('/:id', ensureAuthenticated, getRelatorioFuncionarioController.handle)
relatoriosFuncionariosRoutes.put('/:id', ensureAuthenticated, updateRelatorioFuncionarioController.handle)
relatoriosFuncionariosRoutes.delete('/:id', ensureAuthenticated, deleteRelatorioFuncionarioController.handle)
relatoriosFuncionariosRoutes.delete('/', ensureAuthenticated, multiDeleteRelatorioFuncionarioController.handle)

export { relatoriosFuncionariosRoutes }
