import { Router } from "express"
import { authenticateRoutes } from "./authentication/authenticate-routes"
import { userGroupsRoutes } from "./security/user-groups-routes"
import { blockReasonsRoutes } from "./security/block-reasons-routes"
import { usersRoutes } from "./authentication/users-routes"
import { tfaRoutes } from "./authentication/tfa-routes"
import { usersSecurityRoutes } from "./security/users-security-routes"
import { passwordsRoutes } from "./authentication/passwords-routes"
import { modulesRoutes } from "./security/modules-routes"
import { menuOptionsRoutes } from "./security/menu-options-routes"
import { profilesRoutes } from "./security/profiles-routes"
import { profileOptionsRoutes } from "./security/profile-options-routes"
import { usersProfilesRoutes } from "./security/users-profiles-routes"
import { navigationsRoutes } from "./security/navigations-routes"
import { configsRoutes } from "./security/configs-routes"
import { filtersRoutes } from "./security/filters-routes"
import { paisesRoutes } from "./comum/paises-routes"
import { estadosRoutes } from "./comum/estados-routes"
import { cidadesRoutes } from "./comum/cidades-routes"
import { cepsRoutes } from "./comum/ceps-routes"
import { funcionariosRoutes } from "./cadastros/funcionarios-routes"
import { clientesRoutes } from "./cadastros/clientes-routes"
import { produtosRoutes } from "./cadastros/produtos-routes"
import { garrafoesRoutes } from "./cadastros/garrafoes-routes"
import { meiosPagamentoRoutes } from "./cadastros/meios-pagamento-routes"
import { statusPagamentoRoutes } from "./cadastros/status-pagamento-routes"
import { bonificacoesRoutes } from "./cadastros/bonificacoes-routes"
import { pedidosRoutes } from "./pedido/pedidos-routes"
import { pedidoItensRoutes } from "./pedido/pedido-itens-routes"
import { relatoriosClientesRoutes } from "./relatorios/relatorios-clientes-routes"
import { relatoriosFuncionariosRoutes } from "./relatorios/relatorios-funcionarios-routes"
import { balancosRoutes } from "./clientes/balancos-routes"
import { pagamentosRoutes } from "./clientes/pagamentos-routes"
import { estoquesRoutes } from "./cadastros/estoques-routes"
import { pedidoBonificadosRoutes } from "./pedido/pedido-bonificados-routes"
import { almoxarifadoItensRoutes } from "./almoxarifado/almoxarifado-itens-routes"
import { entradasGarrafaoRoutes } from "./cadastros/entradas-garrafao-routes"
import { descontosRoutes } from "./clientes/descontos-routes"
import { caixasRoutes } from "./financeiro/caixas-routes"
import { controleDespesasRoutes } from "./financeiro/controle-despesas-routes"
import { fechamentosRoutes } from "./financeiro/fechamentos-routes"

const router = Router()

router.use(authenticateRoutes)
router.use("/block-reasons", blockReasonsRoutes)
router.use("/user-groups", userGroupsRoutes)
router.use("/users", usersRoutes)
router.use("/tfa", tfaRoutes)
router.use("/users-security", usersSecurityRoutes)
router.use("/passwords", passwordsRoutes)
router.use("/modules", modulesRoutes)
router.use("/menu-options", menuOptionsRoutes)
router.use("/profiles", profilesRoutes)
router.use("/profile-options", profileOptionsRoutes)
router.use("/users-profiles", usersProfilesRoutes)
router.use("/navigations", navigationsRoutes)
router.use("/configs", configsRoutes)
router.use("/filters", filtersRoutes)
router.use("/paises", paisesRoutes)
router.use("/estados", estadosRoutes)
router.use("/cidades", cidadesRoutes)
router.use("/ceps", cepsRoutes)
router.use("/funcionarios", funcionariosRoutes)
router.use("/clientes", clientesRoutes)
router.use("/produtos", produtosRoutes)
router.use("/estoques", estoquesRoutes)
router.use("/garrafoes", garrafoesRoutes)
router.use("/meios-pagamento", meiosPagamentoRoutes)
router.use("/status-pagamento", statusPagamentoRoutes)
router.use("/bonificacoes", bonificacoesRoutes)
router.use("/pedidos", pedidosRoutes)
router.use("/pedido-itens", pedidoItensRoutes)
router.use("/pedido-bonificados", pedidoBonificadosRoutes)
router.use("/relatorios-clientes", relatoriosClientesRoutes)
router.use("/relatorios-funcionarios", relatoriosFuncionariosRoutes)
router.use("/balancos", balancosRoutes)
router.use("/pagamentos", pagamentosRoutes)
router.use("/almoxarifado-itens", almoxarifadoItensRoutes)
router.use("/entradas-garrafao", entradasGarrafaoRoutes)
router.use("/descontos", descontosRoutes)
router.use("/caixas", caixasRoutes)
router.use("/controle-despesas", controleDespesasRoutes)
router.use("/fechamentos", fechamentosRoutes)

export { router }
