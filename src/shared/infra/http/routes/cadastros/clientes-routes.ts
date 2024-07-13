import { Router } from "express"
import { CreateClienteController } from "@modules/cadastros/use-cases/cliente/create-cliente/create-cliente-controller"
import { ListClienteController } from "@modules/cadastros/use-cases/cliente/list-cliente/list-cliente-controller"
import { CountClienteController } from "@modules/cadastros/use-cases/cliente/count-cliente/count-cliente-controller"
import { SelectClienteController } from "@modules/cadastros/use-cases/cliente/select-cliente/select-cliente-controller"
import { IdSelectClienteController } from "@modules/cadastros/use-cases/cliente/id-select-cliente/id-select-cliente-controller"
import { GetClienteController } from "@modules/cadastros/use-cases/cliente/get-cliente/get-cliente-controller"
import { UpdateClienteController } from "@modules/cadastros/use-cases/cliente/update-cliente/update-cliente-controller"
import { DeleteClienteController } from "@modules/cadastros/use-cases/cliente/delete-cliente/delete-cliente-controller"
import { MultiDeleteClienteController } from "@modules/cadastros/use-cases/cliente/multi-delete-cliente/multi-delete-cliente-controller"
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensure-authenticated"
import { ImportClienteController } from "@modules/cadastros/use-cases/cliente/import-cliente/import-cliente-controller"
import { ExportClienteExcelController } from "@modules/cadastros/use-cases/cliente/export-cliente/export-cliente-controller"
import multer from "multer"
import uploadConfig from "@config/upload"

const uploadFiles = multer(uploadConfig)
const clientesRoutes = Router()

const createClienteController = new CreateClienteController()
const listClienteController = new ListClienteController()
const countClienteController = new CountClienteController()
const selectClienteController = new SelectClienteController()
const idSelectClienteController = new IdSelectClienteController()
const getClienteController = new GetClienteController()
const updateClienteController = new UpdateClienteController()
const deleteClienteController = new DeleteClienteController()
const multiDeleteClienteController = new MultiDeleteClienteController()
const importClienteController = new ImportClienteController()
const exportClienteExcelController = new ExportClienteExcelController()

clientesRoutes.post("/", ensureAuthenticated, createClienteController.handle)
clientesRoutes.post("/import-excel", ensureAuthenticated, uploadFiles.single("arquivos"), importClienteController.handle)
clientesRoutes.post("/list", ensureAuthenticated, listClienteController.handle)
clientesRoutes.post("/count", ensureAuthenticated, countClienteController.handle)
clientesRoutes.get("/select/:id", ensureAuthenticated, idSelectClienteController.handle)
clientesRoutes.get("/select", ensureAuthenticated, selectClienteController.handle)
clientesRoutes.get("/export-excel", ensureAuthenticated, exportClienteExcelController.handle)
clientesRoutes.get("/:id", ensureAuthenticated, getClienteController.handle)
clientesRoutes.put("/:id", ensureAuthenticated, updateClienteController.handle)
clientesRoutes.delete("/:id", ensureAuthenticated, deleteClienteController.handle)
clientesRoutes.delete("/", ensureAuthenticated, multiDeleteClienteController.handle)

export { clientesRoutes }
