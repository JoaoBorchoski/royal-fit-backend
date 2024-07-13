import { Router } from "express"
import { CreateFuncionarioController } from "@modules/cadastros/use-cases/funcionario/create-funcionario/create-funcionario-controller"
import { ListFuncionarioController } from "@modules/cadastros/use-cases/funcionario/list-funcionario/list-funcionario-controller"
import { CountFuncionarioController } from "@modules/cadastros/use-cases/funcionario/count-funcionario/count-funcionario-controller"
import { SelectFuncionarioController } from "@modules/cadastros/use-cases/funcionario/select-funcionario/select-funcionario-controller"
import { IdSelectFuncionarioController } from "@modules/cadastros/use-cases/funcionario/id-select-funcionario/id-select-funcionario-controller"
import { GetFuncionarioController } from "@modules/cadastros/use-cases/funcionario/get-funcionario/get-funcionario-controller"
import { UpdateFuncionarioController } from "@modules/cadastros/use-cases/funcionario/update-funcionario/update-funcionario-controller"
import { DeleteFuncionarioController } from "@modules/cadastros/use-cases/funcionario/delete-funcionario/delete-funcionario-controller"
import { MultiDeleteFuncionarioController } from "@modules/cadastros/use-cases/funcionario/multi-delete-funcionario/multi-delete-funcionario-controller"
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensure-authenticated"
import multer from "multer"
import uploadConfig from "@config/upload"
import { ImportFuncionarioController } from "@modules/cadastros/use-cases/funcionario/import-funcinario/import-funcinario-controller"
import { ExportFornecedorExcelController } from "@modules/cadastros/use-cases/funcionario/export-funcionario/export-funcionario-controller"

const uploadFiles = multer(uploadConfig)
const funcionariosRoutes = Router()

const createFuncionarioController = new CreateFuncionarioController()
const listFuncionarioController = new ListFuncionarioController()
const countFuncionarioController = new CountFuncionarioController()
const selectFuncionarioController = new SelectFuncionarioController()
const idSelectFuncionarioController = new IdSelectFuncionarioController()
const getFuncionarioController = new GetFuncionarioController()
const updateFuncionarioController = new UpdateFuncionarioController()
const deleteFuncionarioController = new DeleteFuncionarioController()
const multiDeleteFuncionarioController = new MultiDeleteFuncionarioController()
const importFuncionarioController = new ImportFuncionarioController()
const exportFornecedorExcelController = new ExportFornecedorExcelController()

funcionariosRoutes.post("/", ensureAuthenticated, createFuncionarioController.handle)
funcionariosRoutes.post("/import-excel", ensureAuthenticated, uploadFiles.single("arquivos"), importFuncionarioController.handle)
funcionariosRoutes.post("/list", ensureAuthenticated, listFuncionarioController.handle)
funcionariosRoutes.post("/count", ensureAuthenticated, countFuncionarioController.handle)
funcionariosRoutes.get("/select/:id", ensureAuthenticated, idSelectFuncionarioController.handle)
funcionariosRoutes.get("/export-excel", ensureAuthenticated, exportFornecedorExcelController.handle)
funcionariosRoutes.get("/select", ensureAuthenticated, selectFuncionarioController.handle)
funcionariosRoutes.get("/:id", ensureAuthenticated, getFuncionarioController.handle)
funcionariosRoutes.put("/:id", ensureAuthenticated, updateFuncionarioController.handle)
funcionariosRoutes.delete("/:id", ensureAuthenticated, deleteFuncionarioController.handle)
funcionariosRoutes.delete("/", ensureAuthenticated, multiDeleteFuncionarioController.handle)

export { funcionariosRoutes }
