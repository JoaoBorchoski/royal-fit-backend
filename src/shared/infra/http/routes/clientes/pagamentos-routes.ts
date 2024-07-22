import { Router } from "express"
import { CreatePagamentoController } from "@modules/clientes/use-cases/pagamento/create-pagamento/create-pagamento-controller"
import { ListPagamentoController } from "@modules/clientes/use-cases/pagamento/list-pagamento/list-pagamento-controller"
import { CountPagamentoController } from "@modules/clientes/use-cases/pagamento/count-pagamento/count-pagamento-controller"
import { SelectPagamentoController } from "@modules/clientes/use-cases/pagamento/select-pagamento/select-pagamento-controller"
import { IdSelectPagamentoController } from "@modules/clientes/use-cases/pagamento/id-select-pagamento/id-select-pagamento-controller"
import { GetPagamentoController } from "@modules/clientes/use-cases/pagamento/get-pagamento/get-pagamento-controller"
import { UpdatePagamentoController } from "@modules/clientes/use-cases/pagamento/update-pagamento/update-pagamento-controller"
import { DeletePagamentoController } from "@modules/clientes/use-cases/pagamento/delete-pagamento/delete-pagamento-controller"
import { MultiDeletePagamentoController } from "@modules/clientes/use-cases/pagamento/multi-delete-pagamento/multi-delete-pagamento-controller"
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensure-authenticated"
import { CreateRelatorioPagamentoController } from "@modules/clientes/use-cases/balanco/create-relatorio-pagamentos/create-relatorio-pagamentos-controller"

const pagamentosRoutes = Router()

const createPagamentoController = new CreatePagamentoController()
const listPagamentoController = new ListPagamentoController()
const countPagamentoController = new CountPagamentoController()
const selectPagamentoController = new SelectPagamentoController()
const idSelectPagamentoController = new IdSelectPagamentoController()
const getPagamentoController = new GetPagamentoController()
const updatePagamentoController = new UpdatePagamentoController()
const deletePagamentoController = new DeletePagamentoController()
const multiDeletePagamentoController = new MultiDeletePagamentoController()
const createRelatorioPagamentoController = new CreateRelatorioPagamentoController()

pagamentosRoutes.post("/", ensureAuthenticated, createPagamentoController.handle)
pagamentosRoutes.post("/relatorio-cliente/:id", ensureAuthenticated, createRelatorioPagamentoController.handle)
pagamentosRoutes.post("/list", ensureAuthenticated, listPagamentoController.handle)
pagamentosRoutes.post("/count", ensureAuthenticated, countPagamentoController.handle)
pagamentosRoutes.get("/select/:id", ensureAuthenticated, idSelectPagamentoController.handle)
pagamentosRoutes.get("/select", ensureAuthenticated, selectPagamentoController.handle)
pagamentosRoutes.get("/:id", ensureAuthenticated, getPagamentoController.handle)
pagamentosRoutes.put("/:id", ensureAuthenticated, updatePagamentoController.handle)
pagamentosRoutes.delete("/:id", ensureAuthenticated, deletePagamentoController.handle)
pagamentosRoutes.delete("/", ensureAuthenticated, multiDeletePagamentoController.handle)

export { pagamentosRoutes }
