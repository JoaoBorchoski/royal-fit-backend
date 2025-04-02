import { Brackets, EntityManager, getRepository, Repository, TransactionManager } from "typeorm"
import { IPedidoDTO } from "@modules/pedido/dtos/i-pedido-dto"
import { IPedidoRepository } from "@modules/pedido/repositories/i-pedido-repository"
import { Pedido } from "@modules/pedido/infra/typeorm/entities/pedido"
import { noContent, serverError, ok, notFound, HttpResponse } from "@shared/helpers"
import { AppError } from "@shared/errors/app-error"
import { PedidoItem } from "../entities/pedido-item"
import { destructor } from "@utils/destructor"
import { Desconto } from "@modules/clientes/infra/typeorm/entities/desconto"

class PedidoRepository implements IPedidoRepository {
  private repository: Repository<Pedido>

  constructor() {
    this.repository = getRepository(Pedido)
  }

  // create
  async create({
    sequencial,
    clienteId,
    data,
    hora,
    valorTotal,
    desconto,
    funcionarioId,
    meioPagamentoId,
    statusPagamentoId,
    isPagamentoPosterior,
    desabilitado,
    tipoEntrega,
  }: IPedidoDTO): Promise<HttpResponse> {
    const pedido = this.repository.create({
      sequencial,
      clienteId,
      data,
      hora,
      valorTotal,
      desconto,
      funcionarioId,
      meioPagamentoId,
      statusPagamentoId,
      isPagamentoPosterior,
      desabilitado,
      tipoEntrega,
    })

    const result = await this.repository
      .save(pedido)
      .then((pedidoResult) => {
        return ok(pedidoResult)
      })
      .catch((error) => {
        return serverError(error)
      })

    return result
  }

  async createWithQueryRunner(
    {
      sequencial,
      clienteId,
      data,
      hora,
      valorTotal,
      desconto,
      descricao,
      funcionarioId,
      meioPagamentoId,
      statusPagamentoId,
      isPagamentoPosterior,
      isLiberado,
      desabilitado,
      tipoEntrega,
    }: IPedidoDTO,
    @TransactionManager() transactionManager: EntityManager
  ): Promise<HttpResponse> {
    const pedido = transactionManager.create(Pedido, {
      sequencial,
      clienteId,
      data,
      hora,
      valorTotal,
      desconto,
      descricao,
      funcionarioId,
      meioPagamentoId,
      statusPagamentoId,
      isPagamentoPosterior,
      isLiberado,
      desabilitado,
      tipoEntrega,
    })

    const result = await transactionManager
      .save(pedido)
      .then((pedidoResult) => {
        return ok(pedidoResult)
      })
      .catch((error) => {
        return serverError(error)
      })

    return result
  }

  // list
  async list(search: string, page: number, rowsPerPage: number, order: string, filter: string): Promise<HttpResponse> {
    let columnName: string
    let columnDirection: "ASC" | "DESC"

    if (typeof order === "undefined" || order === "") {
      columnName = "nome"
      columnDirection = "ASC"
    } else {
      columnName = order.substring(0, 1) === "-" ? order.substring(1) : order
      columnDirection = order.substring(0, 1) === "-" ? "DESC" : "ASC"
    }

    const referenceArray = ["data", "sequencial", "clienteNome", "valorTotal"]
    const columnOrder = new Array<"ASC" | "DESC">(2).fill("ASC")

    const index = referenceArray.indexOf(columnName)

    columnOrder[index] = columnDirection

    const offset = rowsPerPage * page

    try {
      let query = this.repository
        .createQueryBuilder("ped")
        .select([
          'ped.id as "id"',
          'ped.sequencial as "sequencial"',
          'a.id as "clienteId"',
          'a.nome as "clienteNome"',
          'ped.data as "data"',
          'ped.valorTotal :: float as "valorTotal"',
          // 'ped.valorTotal - ped.desconto :: float as "valorTotal"',
          // 'ROUND(CAST((ped.valorTotal - COALESCE(ped.desconto, 0)) AS numeric), 2) as "valorTotal"',
          // 'ROUND(CAST(ped.valorTotal AS numeric), 2) as "valorTotal"',
          'ped.isLiberado as "isLiberado"',
        ])
        .leftJoin("ped.clienteId", "a")
        .where("ped.desabilitado = false")

      if (filter) {
        query = query.where(filter)
      }

      const pedidos = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(ped.sequencial AS VARCHAR) ilike :search", { search: `%${search}%` })
            query.orWhere("a.nome ilike :search", { search: `%${search}%` })
            query.orWhere("TO_CHAR(ped.data, 'YYYY-MM-DD HH24:MI:SS') ILIKE :search", { search: `%${search}%` })
          })
        )
        .addOrderBy("ped.sequencial", "DESC")
        .offset(offset)
        .limit(rowsPerPage)
        .take(rowsPerPage)
        .getRawMany()

      return ok(pedidos)
    } catch (err) {
      console.log(err)
      return serverError(err)
    }
  }

  // select
  async select(filter: string): Promise<HttpResponse> {
    try {
      const pedidos = await this.repository
        .createQueryBuilder("ped")
        .select(['ped.id as "value"', "CONCAT(ped.sequencial, ' - ', a.nome, ' - ', TO_CHAR(ped.data, 'DD/MM/YYYY')) as \"label\""])
        .leftJoin("ped.clienteId", "a")
        .where("ped.sequencial :: varchar ilike :filter", { filter: `${filter}%` })
        .orWhere("a.nome ilike :filter", { filter: `%${filter}%` })
        .orWhere("TO_CHAR(ped.data, 'YYYY-MM-DD HH24:MI:SS') ILIKE :filter", { filter: `%${filter}%` })
        .addOrderBy("ped.sequencial")
        .limit(100)
        .getRawMany()

      return ok(pedidos)
    } catch (err) {
      return serverError(err)
    }
  }

  // id select
  async idSelect(id: string): Promise<HttpResponse> {
    try {
      const pedido = await this.repository
        .createQueryBuilder("ped")
        .select(['ped.id as "value"', "CONCAT(ped.sequencial, ' - ', a.nome, ' - ', TO_CHAR(ped.data, 'DD/MM/YYYY')) as \"label\""])
        .leftJoin("ped.clienteId", "a")
        .where("ped.id = :id", { id: `${id}` })
        .getRawOne()

      console.log(pedido)

      return ok(pedido)
    } catch (err) {
      console.log(err)

      return serverError(err)
    }
  }

  // count
  async count(search: string, filter: string): Promise<HttpResponse> {
    try {
      let query = this.repository.createQueryBuilder("ped").select(['ped.id as "id"']).leftJoin("ped.clienteId", "a")

      if (filter) {
        query = query.where(filter)
      }

      const pedidos = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(ped.sequencial AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .getRawMany()

      return ok({ count: pedidos.length })
    } catch (err) {
      return serverError(err)
    }
  }

  async countWithQueryRunner(search: string, filter: string, @TransactionManager() transactionManager: EntityManager): Promise<HttpResponse> {
    try {
      let query = transactionManager.createQueryBuilder(Pedido, "ped").select(['ped.id as "id"']).leftJoin("ped.clienteId", "a")

      if (filter) {
        query = query.where(filter)
      }

      const pedidos = await query
        .andWhere(
          new Brackets((query) => {
            query.andWhere("CAST(ped.sequencial AS VARCHAR) ilike :search", { search: `%${search}%` })
          })
        )
        .getRawMany()

      return ok({ count: pedidos.length })
    } catch (err) {
      return serverError(err)
    }
  }

  // get
  async get(id: string): Promise<HttpResponse> {
    try {
      const pedido = await this.repository
        .createQueryBuilder("ped")
        .select([
          'ped.id as "id"',
          'ped.sequencial as "sequencial"',
          'ped.clienteId as "clienteId"',
          'ped.data as "data"',
          'ped.hora as "hora"',
          'ped.valorTotal :: float as "valorTotal"',
          'ped.desconto :: float as "desconto"',
          'ped.funcionarioId as "funcionarioId"',
          'ped.meioPagamentoId as "meioPagamentoId"',
          'ped.statusPagamentoId as "statusPagamentoId"',
          'ped.isPagamentoPosterior as "isPagamentoPosterior"',
          'ped.isLiberado as "isLiberado"',
          'ped.desabilitado as "desabilitado"',
          'ped.descricao as "descricao"',
          'ped.tipoEntrega as "tipoEntrega"',
          // 'a.desconto :: float as "desconto"',
        ])
        .leftJoin("ped.clienteId", "a")
        .leftJoin("ped.funcionarioId", "b")
        .leftJoin("ped.meioPagamentoId", "c")
        .leftJoin("ped.statusPagamentoId", "d")
        .where("ped.id = :id", { id })
        .getRawOne()

      if (typeof pedido === "undefined") {
        return noContent()
      }

      const descontos = await getRepository(Desconto)
        .createQueryBuilder("des")
        .select([
          'des.id as "id"',
          'des.clienteId as "clienteId"',
          'des.produtoId as "produtoId"',
          'des.desconto :: float as "desconto"',
          'des.desabilitado as "desabilitado"',
        ])
        .where("des.clienteId = :clienteId", { clienteId: pedido.clienteId })
        .getRawMany()

      pedido.descontos = descontos

      const pedidoItens = await getRepository(PedidoItem)
        .createQueryBuilder("pedItem")
        .select([
          'pedItem.id as "id"',
          'pedItem.produtoId as "produtoId"',
          'prod.nome as "produtoNome"',
          'pedItem.valor_produto as "preco"',
          'pedItem.quantidade as "quantidade"',
          'pedItem.valor :: float as "valor"',
        ])
        .leftJoin("pedItem.pedidoId", "ped")
        .leftJoin("pedItem.produtoId", "prod")
        .where("pedItem.pedidoId = :id", { id })
        .getRawMany()

      if (pedidoItens.length > 0) {
        pedido["pedidoItemForm"] = [...pedidoItens]
      }

      return ok(pedido)
    } catch (err) {
      console.log(err)
      return serverError(err)
    }
  }

  async getByClienteId(clienteId: string): Promise<HttpResponse> {
    try {
      const pedidos = await this.repository
        .createQueryBuilder("ped")
        .select([
          'ped.id as "id"',
          'ped.sequencial as "sequencial"',
          'ped.data as "data"',
          'ped.valorTotal :: float as "valorTotal"',
          'ped.meioPagamentoId as "meioPagamentoId"',
        ])
        .where("ped.clienteId = :clienteId", { clienteId })
        .orderBy("ped.sequencial", "DESC")
        .getRawMany()

      for await (const pedido of pedidos) {
        pedido.statusPagamentoId = pedido.meioPagamentoId == "9751732c-4ed8-465f-96f1-2d2580b33a5d" ? "Não" : "Sim"
        pedido.data = pedido.data.toLocaleDateString("pt-BR")
      }

      return ok(pedidos)
    } catch (err) {
      return serverError(err)
    }
  }

  // update
  async update(
    {
      id,
      sequencial,
      clienteId,
      data,
      hora,
      valorTotal,
      desconto,
      descricao,
      isLiberado,
      funcionarioId,
      meioPagamentoId,
      statusPagamentoId,
      isPagamentoPosterior,
      desabilitado,
      tipoEntrega,
    }: IPedidoDTO,
    @TransactionManager() transactionManager: EntityManager
  ): Promise<HttpResponse> {
    const pedido = await transactionManager.findOne(Pedido, id)

    if (!pedido) {
      return notFound()
    }

    const newpedido = transactionManager.create(Pedido, {
      id,
      sequencial,
      clienteId,
      data,
      hora,
      valorTotal,
      desconto,
      descricao,
      isLiberado,
      funcionarioId,
      meioPagamentoId,
      statusPagamentoId,
      isPagamentoPosterior,
      desabilitado,
      tipoEntrega,
    })

    try {
      await transactionManager.save(newpedido)

      return ok(newpedido)
    } catch (err) {
      return serverError(err)
    }
  }

  // delete
  async delete(id: string): Promise<HttpResponse> {
    try {
      await this.repository.update(id, { desabilitado: true })

      return noContent()
    } catch (err) {
      if (err.message.slice(0, 10) === "null value") {
        throw new AppError("not null constraint", 404)
      }

      return serverError(err)
    }
  }

  // multi delete
  async multiDelete(ids: string[]): Promise<HttpResponse> {
    try {
      await this.repository.update(ids, { desabilitado: true })

      return noContent()
    } catch (err) {
      if (err.message.slice(0, 10) === "null value") {
        throw new AppError("not null constraint", 404)
      }

      return serverError(err)
    }
  }

  async getPedidosByDataAndCliente(dataInicio: Date, dataFim: Date, clienteId: string): Promise<HttpResponse> {
    try {
      const pedidos = await this.repository
        .createQueryBuilder("ped")
        .select([
          'ped.id as "id"',
          'ped.data as "data"',
          'ped.valorTotal :: float as "valorTotal"',
          'ped.desconto :: float as "desconto"',
          'a.id as "funcionarioId"',
          'a.nome as "funcionarioNome"',
          'c.id as "clienteId"',
          'c.nome as "clienteNome"',
          'ped.sequencial as "sequencial"',
        ])
        .leftJoin("ped.funcionarioId", "a")
        .leftJoin("ped.clienteId", "c")
        .where("ped.data >= :dataInicio", { dataInicio })
        .andWhere("ped.data <= :dataFim", { dataFim })
        .andWhere("ped.desabilitado = false")
        .andWhere("c.id = :clienteId", { clienteId })
        .orderBy("ped.sequencial", "ASC")
        .getRawMany()

      for await (const pedido of pedidos) {
        const pedidoItens = await getRepository(PedidoItem)
          .createQueryBuilder("pedItem")
          .select([
            'pedItem.id as "id"',
            'pedItem.produtoId as "produtoId"',
            'prod.nome as "produtoNome"',
            'ROUND((prod.preco * (1 - COALESCE(des.desconto, 0) / 100)), 2) :: float as "preco"',
            'pedItem.quantidade as "quantidade"',
            'pedItem.valor :: float as "valor"',
          ])
          .leftJoin("pedItem.pedidoId", "ped")
          .leftJoin("pedItem.produtoId", "prod")
          .leftJoin("descontos", "des", "des.produto_id = pedItem.produto_id AND des.cliente_id = :clienteId", {
            clienteId,
          })
          .where("pedItem.pedidoId = :id", { id: pedido.id })
          .getRawMany()

        pedido["pedidoItens"] = [...pedidoItens]
      }

      return ok(pedidos)
    } catch (err) {
      console.log(err)
      return serverError(err)
    }
  }

  async getAllPedidosByData(dataInicio: Date, dataFim: Date): Promise<HttpResponse> {
    try {
      const pedidos = await this.repository
        .createQueryBuilder("ped")
        .select([
          'ped.id as "id"',
          'ped.data as "data"',
          'ped.valorTotal :: float as "valorTotal"',
          'a.id as "funcionarioId"',
          'a.nome as "funcionarioNome"',
          'c.id as "clienteId"',
          'c.nome as "clienteNome"',
          'b.saldoDevedor :: float as "saldoDevedor"',
        ])
        .leftJoin("ped.funcionarioId", "a")
        .leftJoin("ped.clienteId", "c")
        .leftJoin("balancos", "b", "c.id = b.clienteId")
        .where("ped.data >= :dataInicio", { dataInicio })
        .andWhere("ped.data <= :dataFim", { dataFim })
        .getRawMany()

      const newPedidos = destructor({
        data: pedidos,
        ref: "clienteId",
        variablesToArray: ["id", "data", "valorTotal", "funcionarioId", "funcionarioNome"],
        nameArrayVariable: "pedidos",
      })

      return ok(newPedidos)
    } catch (err) {
      return serverError(err)
    }
  }
}

export { PedidoRepository }
