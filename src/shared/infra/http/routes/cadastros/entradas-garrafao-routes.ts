import { Router } from "express"
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensure-authenticated"
import { CreateEntradaGarrafaoController } from "@modules/cadastros/use-cases/entrada-garrafao/create-entrada-garrafao/create-entrada-garrafao-controller"
import { ListEntradaGarrafaoController } from "@modules/cadastros/use-cases/entrada-garrafao/list-entrada-garrafao/list-entrada-garrafao-controller"
import { CountEntradaGarrafaoController } from "@modules/cadastros/use-cases/entrada-garrafao/count-entrada-garrafao/count-entrada-garrafao-controller"
import { IdSelectEntradaGarrafaoController } from "@modules/cadastros/use-cases/entrada-garrafao/id-select-entrada-garrafao/id-select-entrada-garrafao-controller"
import { SelectEntradaGarrafaoController } from "@modules/cadastros/use-cases/entrada-garrafao/select-entrada-garrafao/select-entrada-garrafao-controller"
import { GetEntradaGarrafaoController } from "@modules/cadastros/use-cases/entrada-garrafao/get-entrada-garrafao/get-entrada-garrafao-controller"
import { UpdateEntradaGarrafaoController } from "@modules/cadastros/use-cases/entrada-garrafao/update-entrada-garrafao/update-entrada-garrafao-controller"
import { DeleteEntradaGarrafaoController } from "@modules/cadastros/use-cases/entrada-garrafao/delete-entrada-garrafao/delete-entrada-garrafao-controller"
import { MultiDeleteEntradaGarrafaoController } from "@modules/cadastros/use-cases/entrada-garrafao/multi-delete-entrada-garrafao/multi-delete-entrada-garrafao-controller"

const entradasGarrafaoRoutes = Router()

const createEntradaGarrafaoController = new CreateEntradaGarrafaoController()
const listEntradaGarrafaoController = new ListEntradaGarrafaoController()
const countEntradaGarrafaoController = new CountEntradaGarrafaoController()
const selectEntradaGarrafaoController = new SelectEntradaGarrafaoController()
const idSelectEntradaGarrafaoController = new IdSelectEntradaGarrafaoController()
const getEntradaGarrafaoController = new GetEntradaGarrafaoController()
const updateEntradaGarrafaoController = new UpdateEntradaGarrafaoController()
const deleteEntradaGarrafaoController = new DeleteEntradaGarrafaoController()
const multiDeleteEntradaGarrafaoController = new MultiDeleteEntradaGarrafaoController()

entradasGarrafaoRoutes.post("/", ensureAuthenticated, createEntradaGarrafaoController.handle)
entradasGarrafaoRoutes.post("/list", ensureAuthenticated, listEntradaGarrafaoController.handle)
entradasGarrafaoRoutes.post("/count", ensureAuthenticated, countEntradaGarrafaoController.handle)
entradasGarrafaoRoutes.get("/select/:id", ensureAuthenticated, idSelectEntradaGarrafaoController.handle)
entradasGarrafaoRoutes.get("/select", ensureAuthenticated, selectEntradaGarrafaoController.handle)
entradasGarrafaoRoutes.get("/:id", ensureAuthenticated, getEntradaGarrafaoController.handle)
entradasGarrafaoRoutes.put("/:id", ensureAuthenticated, updateEntradaGarrafaoController.handle)
entradasGarrafaoRoutes.delete("/:id", ensureAuthenticated, deleteEntradaGarrafaoController.handle)
entradasGarrafaoRoutes.delete("/", ensureAuthenticated, multiDeleteEntradaGarrafaoController.handle)

export { entradasGarrafaoRoutes }
