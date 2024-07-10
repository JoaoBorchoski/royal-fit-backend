import { Router } from 'express'
import { CreateProdutoController } from '@modules/cadastros/use-cases/produto/create-produto/create-produto-controller'
import { ListProdutoController } from '@modules/cadastros/use-cases/produto/list-produto/list-produto-controller'
import { CountProdutoController } from '@modules/cadastros/use-cases/produto/count-produto/count-produto-controller'
import { SelectProdutoController } from '@modules/cadastros/use-cases/produto/select-produto/select-produto-controller'
import { IdSelectProdutoController } from '@modules/cadastros/use-cases/produto/id-select-produto/id-select-produto-controller'
import { GetProdutoController } from '@modules/cadastros/use-cases/produto/get-produto/get-produto-controller'
import { UpdateProdutoController } from '@modules/cadastros/use-cases/produto/update-produto/update-produto-controller'
import { DeleteProdutoController } from '@modules/cadastros/use-cases/produto/delete-produto/delete-produto-controller'
import { MultiDeleteProdutoController } from '@modules/cadastros/use-cases/produto/multi-delete-produto/multi-delete-produto-controller'
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensure-authenticated'

const produtosRoutes = Router()

const createProdutoController = new CreateProdutoController()
const listProdutoController = new ListProdutoController()
const countProdutoController = new CountProdutoController()
const selectProdutoController = new SelectProdutoController()
const idSelectProdutoController = new IdSelectProdutoController()
const getProdutoController = new GetProdutoController()
const updateProdutoController = new UpdateProdutoController()
const deleteProdutoController = new DeleteProdutoController()
const multiDeleteProdutoController = new MultiDeleteProdutoController()

produtosRoutes.post('/', ensureAuthenticated, createProdutoController.handle)
produtosRoutes.post('/list', ensureAuthenticated, listProdutoController.handle)
produtosRoutes.post('/count', ensureAuthenticated, countProdutoController.handle)
produtosRoutes.get('/select/:id', ensureAuthenticated, idSelectProdutoController.handle)
produtosRoutes.get('/select', ensureAuthenticated, selectProdutoController.handle)
produtosRoutes.get('/:id', ensureAuthenticated, getProdutoController.handle)
produtosRoutes.put('/:id', ensureAuthenticated, updateProdutoController.handle)
produtosRoutes.delete('/:id', ensureAuthenticated, deleteProdutoController.handle)
produtosRoutes.delete('/', ensureAuthenticated, multiDeleteProdutoController.handle)

export { produtosRoutes }
