import { Router } from "express"
import { CreateControleDespesaController } from "@modules/financeiro/use-cases/controle-despesa/create-controle-despesa/create-controle-despesa-controller"
import { ListControleDespesaController } from "@modules/financeiro/use-cases/controle-despesa/list-controle-despesa/list-controle-despesa-controller"
import { CountControleDespesaController } from "@modules/financeiro/use-cases/controle-despesa/count-controle-despesa/count-controle-despesa-controller"
import { SelectControleDespesaController } from "@modules/financeiro/use-cases/controle-despesa/select-controle-despesa/select-controle-despesa-controller"
import { IdSelectControleDespesaController } from "@modules/financeiro/use-cases/controle-despesa/id-select-controle-despesa/id-select-controle-despesa-controller"
import { GetControleDespesaController } from "@modules/financeiro/use-cases/controle-despesa/get-controle-despesa/get-controle-despesa-controller"
import { UpdateControleDespesaController } from "@modules/financeiro/use-cases/controle-despesa/update-controle-despesa/update-controle-despesa-controller"
import { DeleteControleDespesaController } from "@modules/financeiro/use-cases/controle-despesa/delete-controle-despesa/delete-controle-despesa-controller"
import { MultiDeleteControleDespesaController } from "@modules/financeiro/use-cases/controle-despesa/multi-delete-controle-despesa/multi-delete-controle-despesa-controller"
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensure-authenticated"

const controleDespesasRoutes = Router()

const createControleDespesaController = new CreateControleDespesaController()
const listControleDespesaController = new ListControleDespesaController()
const countControleDespesaController = new CountControleDespesaController()
const selectControleDespesaController = new SelectControleDespesaController()
const idSelectControleDespesaController = new IdSelectControleDespesaController()
const getControleDespesaController = new GetControleDespesaController()
const updateControleDespesaController = new UpdateControleDespesaController()
const deleteControleDespesaController = new DeleteControleDespesaController()
const multiDeleteControleDespesaController = new MultiDeleteControleDespesaController()

controleDespesasRoutes.post("/", ensureAuthenticated, createControleDespesaController.handle)
controleDespesasRoutes.post("/list", ensureAuthenticated, listControleDespesaController.handle)
controleDespesasRoutes.post("/count", ensureAuthenticated, countControleDespesaController.handle)
controleDespesasRoutes.get("/select/:id", ensureAuthenticated, idSelectControleDespesaController.handle)
controleDespesasRoutes.get("/select", ensureAuthenticated, selectControleDespesaController.handle)
controleDespesasRoutes.get("/:id", ensureAuthenticated, getControleDespesaController.handle)
controleDespesasRoutes.put("/:id", ensureAuthenticated, updateControleDespesaController.handle)
controleDespesasRoutes.delete("/:id", ensureAuthenticated, deleteControleDespesaController.handle)
controleDespesasRoutes.delete("/", ensureAuthenticated, multiDeleteControleDespesaController.handle)

export { controleDespesasRoutes }
