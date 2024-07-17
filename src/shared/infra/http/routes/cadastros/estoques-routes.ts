import { Router } from "express"
import { CreateEstoqueController } from "@modules/cadastros/use-cases/estoque/create-estoque/create-estoque-controller"
import { ListEstoqueController } from "@modules/cadastros/use-cases/estoque/list-estoque/list-estoque-controller"
import { CountEstoqueController } from "@modules/cadastros/use-cases/estoque/count-estoque/count-estoque-controller"
import { SelectEstoqueController } from "@modules/cadastros/use-cases/estoque/select-estoque/select-estoque-controller"
import { IdSelectEstoqueController } from "@modules/cadastros/use-cases/estoque/id-select-estoque/id-select-estoque-controller"
import { GetEstoqueController } from "@modules/cadastros/use-cases/estoque/get-estoque/get-estoque-controller"
import { UpdateEstoqueController } from "@modules/cadastros/use-cases/estoque/update-estoque/update-estoque-controller"
import { DeleteEstoqueController } from "@modules/cadastros/use-cases/estoque/delete-estoque/delete-estoque-controller"
import { MultiDeleteEstoqueController } from "@modules/cadastros/use-cases/estoque/multi-delete-estoque/multi-delete-estoque-controller"
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensure-authenticated"
import { ImportEstoqueController } from "@modules/cadastros/use-cases/estoque/import-estoque/import-estoque-controller"
import { ExportEstoqueExcelController } from "@modules/cadastros/use-cases/estoque/export-estoque/export-estoque-controller"
import multer from "multer"
import uploadConfig from "@config/upload"

const uploadFiles = multer(uploadConfig)
const estoquesRoutes = Router()

const createEstoqueController = new CreateEstoqueController()
const listEstoqueController = new ListEstoqueController()
const countEstoqueController = new CountEstoqueController()
const selectEstoqueController = new SelectEstoqueController()
const idSelectEstoqueController = new IdSelectEstoqueController()
const getEstoqueController = new GetEstoqueController()
const updateEstoqueController = new UpdateEstoqueController()
const deleteEstoqueController = new DeleteEstoqueController()
const multiDeleteEstoqueController = new MultiDeleteEstoqueController()
const importEstoqueController = new ImportEstoqueController()
const exportEstoqueExcelController = new ExportEstoqueExcelController()

estoquesRoutes.post("/", ensureAuthenticated, createEstoqueController.handle)
estoquesRoutes.post("/import-excel", ensureAuthenticated, uploadFiles.single("arquivos"), importEstoqueController.handle)
estoquesRoutes.post("/list", ensureAuthenticated, listEstoqueController.handle)
estoquesRoutes.post("/count", ensureAuthenticated, countEstoqueController.handle)
estoquesRoutes.get("/select/:id", ensureAuthenticated, idSelectEstoqueController.handle)
estoquesRoutes.get("/select", ensureAuthenticated, selectEstoqueController.handle)
estoquesRoutes.get("/export-excel", ensureAuthenticated, exportEstoqueExcelController.handle)
estoquesRoutes.get("/:id", ensureAuthenticated, getEstoqueController.handle)
estoquesRoutes.put("/:id", ensureAuthenticated, updateEstoqueController.handle)
estoquesRoutes.delete("/:id", ensureAuthenticated, deleteEstoqueController.handle)
estoquesRoutes.delete("/", ensureAuthenticated, multiDeleteEstoqueController.handle)

export { estoquesRoutes }
