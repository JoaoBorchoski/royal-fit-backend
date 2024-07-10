import { Router } from 'express'
import { CreateBonificacaoController } from '@modules/cadastros/use-cases/bonificacao/create-bonificacao/create-bonificacao-controller'
import { ListBonificacaoController } from '@modules/cadastros/use-cases/bonificacao/list-bonificacao/list-bonificacao-controller'
import { CountBonificacaoController } from '@modules/cadastros/use-cases/bonificacao/count-bonificacao/count-bonificacao-controller'
import { SelectBonificacaoController } from '@modules/cadastros/use-cases/bonificacao/select-bonificacao/select-bonificacao-controller'
import { IdSelectBonificacaoController } from '@modules/cadastros/use-cases/bonificacao/id-select-bonificacao/id-select-bonificacao-controller'
import { GetBonificacaoController } from '@modules/cadastros/use-cases/bonificacao/get-bonificacao/get-bonificacao-controller'
import { UpdateBonificacaoController } from '@modules/cadastros/use-cases/bonificacao/update-bonificacao/update-bonificacao-controller'
import { DeleteBonificacaoController } from '@modules/cadastros/use-cases/bonificacao/delete-bonificacao/delete-bonificacao-controller'
import { MultiDeleteBonificacaoController } from '@modules/cadastros/use-cases/bonificacao/multi-delete-bonificacao/multi-delete-bonificacao-controller'
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensure-authenticated'

const bonificacoesRoutes = Router()

const createBonificacaoController = new CreateBonificacaoController()
const listBonificacaoController = new ListBonificacaoController()
const countBonificacaoController = new CountBonificacaoController()
const selectBonificacaoController = new SelectBonificacaoController()
const idSelectBonificacaoController = new IdSelectBonificacaoController()
const getBonificacaoController = new GetBonificacaoController()
const updateBonificacaoController = new UpdateBonificacaoController()
const deleteBonificacaoController = new DeleteBonificacaoController()
const multiDeleteBonificacaoController = new MultiDeleteBonificacaoController()

bonificacoesRoutes.post('/', ensureAuthenticated, createBonificacaoController.handle)
bonificacoesRoutes.post('/list', ensureAuthenticated, listBonificacaoController.handle)
bonificacoesRoutes.post('/count', ensureAuthenticated, countBonificacaoController.handle)
bonificacoesRoutes.get('/select/:id', ensureAuthenticated, idSelectBonificacaoController.handle)
bonificacoesRoutes.get('/select', ensureAuthenticated, selectBonificacaoController.handle)
bonificacoesRoutes.get('/:id', ensureAuthenticated, getBonificacaoController.handle)
bonificacoesRoutes.put('/:id', ensureAuthenticated, updateBonificacaoController.handle)
bonificacoesRoutes.delete('/:id', ensureAuthenticated, deleteBonificacaoController.handle)
bonificacoesRoutes.delete('/', ensureAuthenticated, multiDeleteBonificacaoController.handle)

export { bonificacoesRoutes }
