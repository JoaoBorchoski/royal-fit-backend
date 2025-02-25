import { container } from "tsyringe"

import "@shared/container/providers"

import { IUserRepository } from "@modules/authentication/repositories/i-user-repository"
import { UserRepository } from "@modules/authentication/infra/typeorm/repositories/user-repository"
import { IUserSecurityRepository } from "@modules/security/repositories/i-user-security-repository"
import { UserSecurityRepository } from "@modules/security/infra/typeorm/repositories/user-security-repository"
import { IUserTokenRepository } from "@modules/authentication/repositories/i-user-token-repository"
import { UserTokenRepository } from "@modules/authentication/infra/typeorm/repositories/user-token-repository"
import { IBlockReasonRepository } from "@modules/security/repositories/i-block-reason-repository"
import { BlockReasonRepository } from "@modules/security/infra/typeorm/repositories/block-reason-repository"
import { IUserGroupRepository } from "@modules/security/repositories/i-user-group-repository"
import { UserGroupRepository } from "@modules/security/infra/typeorm/repositories/user-group-repository"
import { IModuleRepository } from "@modules/security/repositories/i-module-repository"
import { ModuleRepository } from "@modules/security/infra/typeorm/repositories/module-repository"
import { IProfileRepository } from "@modules/security/repositories/i-profile-repository"
import { ProfileRepository } from "@modules/security/infra/typeorm/repositories/profile-repository"
import { IMenuOptionRepository } from "@modules/security/repositories/i-menu-option-repository"
import { MenuOptionRepository } from "@modules/security/infra/typeorm/repositories/menu-option-repository"
import { INavigationRepository } from "@modules/security/repositories/i-navigation-repository"
import { NavigationRepository } from "@modules/security/infra/typeorm/repositories/navigation-repository"
import { IUserProfileRepository } from "@modules/security/repositories/i-user-profile-repository"
import { UserProfileRepository } from "@modules/security/infra/typeorm/repositories/user-profile-repository"
import { IProfileOptionRepository } from "@modules/security/repositories/i-profile-option-repository"
import { ProfileOptionRepository } from "@modules/security/infra/typeorm/repositories/profile-option-repository"
import { IConfigRepository } from "@modules/security/repositories/i-config-repository"
import { ConfigRepository } from "@modules/security/infra/typeorm/repositories/config-repository"
import { IFilterRepository } from "@modules/security/repositories/i-filter-repository"
import { FilterRepository } from "@modules/security/infra/typeorm/repositories/filter-repository"
import { IPaisRepository } from "@modules/comum/repositories/i-pais-repository"
import { PaisRepository } from "@modules/comum/infra/typeorm/repositories/pais-repository"
import { IEstadoRepository } from "@modules/comum/repositories/i-estado-repository"
import { EstadoRepository } from "@modules/comum/infra/typeorm/repositories/estado-repository"
import { ICidadeRepository } from "@modules/comum/repositories/i-cidade-repository"
import { CidadeRepository } from "@modules/comum/infra/typeorm/repositories/cidade-repository"
import { ICepRepository } from "@modules/comum/repositories/i-cep-repository"
import { CepRepository } from "@modules/comum/infra/typeorm/repositories/cep-repository"
import { IFuncionarioRepository } from "@modules/cadastros/repositories/i-funcionario-repository"
import { FuncionarioRepository } from "@modules/cadastros/infra/typeorm/repositories/funcionario-repository"
import { IClienteRepository } from "@modules/cadastros/repositories/i-cliente-repository"
import { ClienteRepository } from "@modules/cadastros/infra/typeorm/repositories/cliente-repository"
import { IProdutoRepository } from "@modules/cadastros/repositories/i-produto-repository"
import { ProdutoRepository } from "@modules/cadastros/infra/typeorm/repositories/produto-repository"
import { IGarrafaoRepository } from "@modules/cadastros/repositories/i-garrafao-repository"
import { GarrafaoRepository } from "@modules/cadastros/infra/typeorm/repositories/garrafao-repository"
import { IMeioPagamentoRepository } from "@modules/cadastros/repositories/i-meio-pagamento-repository"
import { MeioPagamentoRepository } from "@modules/cadastros/infra/typeorm/repositories/meio-pagamento-repository"
import { IStatusPagamentoRepository } from "@modules/cadastros/repositories/i-status-pagamento-repository"
import { StatusPagamentoRepository } from "@modules/cadastros/infra/typeorm/repositories/status-pagamento-repository"
import { IBonificacaoRepository } from "@modules/cadastros/repositories/i-bonificacao-repository"
import { BonificacaoRepository } from "@modules/cadastros/infra/typeorm/repositories/bonificacao-repository"
import { IPedidoRepository } from "@modules/pedido/repositories/i-pedido-repository"
import { PedidoRepository } from "@modules/pedido/infra/typeorm/repositories/pedido-repository"
import { IPedidoItemRepository } from "@modules/pedido/repositories/i-pedido-item-repository"
import { PedidoItemRepository } from "@modules/pedido/infra/typeorm/repositories/pedido-item-repository"
import { IRelatorioClienteRepository } from "@modules/relatorios/repositories/i-relatorio-cliente-repository"
import { RelatorioClienteRepository } from "@modules/relatorios/infra/typeorm/repositories/relatorio-cliente-repository"
import { IRelatorioFuncionarioRepository } from "@modules/relatorios/repositories/i-relatorio-funcionario-repository"
import { RelatorioFuncionarioRepository } from "@modules/relatorios/infra/typeorm/repositories/relatorio-funcionario-repository"
import { IBalancoRepository } from "@modules/clientes/repositories/i-balanco-repository"
import { BalancoRepository } from "@modules/clientes/infra/typeorm/repositories/balanco-repository"
import { IPagamentoRepository } from "@modules/clientes/repositories/i-pagamento-repository"
import { PagamentoRepository } from "@modules/clientes/infra/typeorm/repositories/pagamento-repository"
import { IEstoqueRepository } from "@modules/cadastros/repositories/i-estoque-repository"
import { EstoqueRepository } from "@modules/cadastros/infra/typeorm/repositories/estoque-repository"
import { IPedidoBonificadoRepository } from "@modules/pedido/repositories/i-pedido-bonificado-repository"
import { PedidoBonificadoRepository } from "@modules/pedido/infra/typeorm/repositories/pedido-bonificado-repository"
import { AlmoxarifadoItemRepository } from "@modules/almoxarifado/infra/typeorm/repositories/almoxarifado-item-repository"
import { IAlmoxarifadoItemRepository } from "@modules/almoxarifado/repositories/i-almoxarifado-item-repository"
import { EntradaGarrafaoRepository } from "@modules/cadastros/infra/typeorm/repositories/entrada-garrafao-repository"
import { IEntradaGarrafaoRepository } from "@modules/cadastros/repositories/i-entrada-garrafao-repository"
import { DescontoRepository } from "@modules/clientes/infra/typeorm/repositories/desconto-repository"
import { IDescontoRepository } from "@modules/clientes/repositories/i-desconto-repository"
import { CaixaRepository } from "@modules/financeiro/infra/typeorm/repositories/caixa-repository"
import { ControleDespesaRepository } from "@modules/financeiro/infra/typeorm/repositories/controle-despesa-repository"
import { FechamentoRepository } from "@modules/financeiro/infra/typeorm/repositories/fechamento-repository"
import { ICaixaRepository } from "@modules/financeiro/repositories/i-caixa-repository"
import { IControleDespesaRepository } from "@modules/financeiro/repositories/i-controle-despesa-repository"
import { IFechamentoRepository } from "@modules/financeiro/repositories/i-fechamento-repository"

container.registerSingleton<IUserRepository>("UserRepository", UserRepository)
container.registerSingleton<IUserSecurityRepository>("UserSecurityRepository", UserSecurityRepository)
container.registerSingleton<IUserTokenRepository>("UserTokenRepository", UserTokenRepository)
container.registerSingleton<IBlockReasonRepository>("BlockReasonRepository", BlockReasonRepository)
container.registerSingleton<IUserGroupRepository>("UserGroupRepository", UserGroupRepository)
container.registerSingleton<IModuleRepository>("ModuleRepository", ModuleRepository)
container.registerSingleton<IProfileRepository>("ProfileRepository", ProfileRepository)
container.registerSingleton<IMenuOptionRepository>("MenuOptionRepository", MenuOptionRepository)
container.registerSingleton<INavigationRepository>("NavigationRepository", NavigationRepository)
container.registerSingleton<IUserProfileRepository>("UserProfileRepository", UserProfileRepository)
container.registerSingleton<IProfileOptionRepository>("ProfileOptionRepository", ProfileOptionRepository)
container.registerSingleton<IConfigRepository>("ConfigRepository", ConfigRepository)
container.registerSingleton<IFilterRepository>("FilterRepository", FilterRepository)
container.registerSingleton<IPaisRepository>("PaisRepository", PaisRepository)
container.registerSingleton<IEstadoRepository>("EstadoRepository", EstadoRepository)
container.registerSingleton<ICidadeRepository>("CidadeRepository", CidadeRepository)
container.registerSingleton<ICepRepository>("CepRepository", CepRepository)
container.registerSingleton<IFuncionarioRepository>("FuncionarioRepository", FuncionarioRepository)
container.registerSingleton<IClienteRepository>("ClienteRepository", ClienteRepository)
container.registerSingleton<IProdutoRepository>("ProdutoRepository", ProdutoRepository)
container.registerSingleton<IGarrafaoRepository>("GarrafaoRepository", GarrafaoRepository)
container.registerSingleton<IMeioPagamentoRepository>("MeioPagamentoRepository", MeioPagamentoRepository)
container.registerSingleton<IStatusPagamentoRepository>("StatusPagamentoRepository", StatusPagamentoRepository)
container.registerSingleton<IBonificacaoRepository>("BonificacaoRepository", BonificacaoRepository)
container.registerSingleton<IPedidoRepository>("PedidoRepository", PedidoRepository)
container.registerSingleton<IPedidoItemRepository>("PedidoItemRepository", PedidoItemRepository)
container.registerSingleton<IPedidoBonificadoRepository>("PedidoBonificadoRepository", PedidoBonificadoRepository)
container.registerSingleton<IRelatorioClienteRepository>("RelatorioClienteRepository", RelatorioClienteRepository)
container.registerSingleton<IRelatorioFuncionarioRepository>("RelatorioFuncionarioRepository", RelatorioFuncionarioRepository)
container.registerSingleton<IBalancoRepository>("BalancoRepository", BalancoRepository)
container.registerSingleton<IPagamentoRepository>("PagamentoRepository", PagamentoRepository)
container.registerSingleton<IEstoqueRepository>("EstoqueRepository", EstoqueRepository)
container.registerSingleton<IAlmoxarifadoItemRepository>("AlmoxarifadoItemRepository", AlmoxarifadoItemRepository)
container.registerSingleton<IEntradaGarrafaoRepository>("EntradaGarrafaoRepository", EntradaGarrafaoRepository)
container.registerSingleton<IDescontoRepository>("DescontoRepository", DescontoRepository)
container.registerSingleton<ICaixaRepository>("CaixaRepository", CaixaRepository)
container.registerSingleton<IControleDespesaRepository>("ControleDespesaRepository", ControleDespesaRepository)
container.registerSingleton<IFechamentoRepository>("FechamentoRepository", FechamentoRepository)
