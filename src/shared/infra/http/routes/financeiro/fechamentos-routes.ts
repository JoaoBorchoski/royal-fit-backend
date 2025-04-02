import { Router } from "express"
import { CreateFechamentoController } from "@modules/financeiro/use-cases/fechamento/create-fechamento/create-fechamento-controller"
import { ListFechamentoController } from "@modules/financeiro/use-cases/fechamento/list-fechamento/list-fechamento-controller"
import { CountFechamentoController } from "@modules/financeiro/use-cases/fechamento/count-fechamento/count-fechamento-controller"
import { SelectFechamentoController } from "@modules/financeiro/use-cases/fechamento/select-fechamento/select-fechamento-controller"
import { IdSelectFechamentoController } from "@modules/financeiro/use-cases/fechamento/id-select-fechamento/id-select-fechamento-controller"
import { GetFechamentoController } from "@modules/financeiro/use-cases/fechamento/get-fechamento/get-fechamento-controller"
import { UpdateFechamentoController } from "@modules/financeiro/use-cases/fechamento/update-fechamento/update-fechamento-controller"
import { DeleteFechamentoController } from "@modules/financeiro/use-cases/fechamento/delete-fechamento/delete-fechamento-controller"
import { MultiDeleteFechamentoController } from "@modules/financeiro/use-cases/fechamento/multi-delete-fechamento/multi-delete-fechamento-controller"
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensure-authenticated"
import { GetFechamentoDataController } from "@modules/financeiro/use-cases/fechamento/get-fechamento-data/get-fechamento-data-controller"
import { GetFechamentoRelatorioController } from "@modules/financeiro/use-cases/fechamento/get-fechamento-relatorio/get-fechamento-relatorio-controller"

const fechamentosRoutes = Router()

const createFechamentoController = new CreateFechamentoController()
const listFechamentoController = new ListFechamentoController()
const countFechamentoController = new CountFechamentoController()
const selectFechamentoController = new SelectFechamentoController()
const idSelectFechamentoController = new IdSelectFechamentoController()
const getFechamentoController = new GetFechamentoController()
const updateFechamentoController = new UpdateFechamentoController()
const deleteFechamentoController = new DeleteFechamentoController()
const multiDeleteFechamentoController = new MultiDeleteFechamentoController()
const getFechamentoDataController = new GetFechamentoDataController()
const getFechamentoRelatorioController = new GetFechamentoRelatorioController()

fechamentosRoutes.post("/", ensureAuthenticated, createFechamentoController.handle)
fechamentosRoutes.post("/list", ensureAuthenticated, listFechamentoController.handle)
fechamentosRoutes.post("/count", ensureAuthenticated, countFechamentoController.handle)
fechamentosRoutes.post("/relatorio", ensureAuthenticated, getFechamentoRelatorioController.handle)
fechamentosRoutes.get("/select/:id", ensureAuthenticated, idSelectFechamentoController.handle)
fechamentosRoutes.get("/select", ensureAuthenticated, selectFechamentoController.handle)
fechamentosRoutes.get("/:id", ensureAuthenticated, getFechamentoController.handle)
fechamentosRoutes.get("/", ensureAuthenticated, getFechamentoDataController.handle)
fechamentosRoutes.put("/:id", ensureAuthenticated, updateFechamentoController.handle)
fechamentosRoutes.delete("/:id", ensureAuthenticated, deleteFechamentoController.handle)
fechamentosRoutes.delete("/", ensureAuthenticated, multiDeleteFechamentoController.handle)

export { fechamentosRoutes }
