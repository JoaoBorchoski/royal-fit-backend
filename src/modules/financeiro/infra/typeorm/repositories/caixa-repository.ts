import { Brackets, EntityManager, getRepository, Repository, TransactionManager } from "typeorm"
import { ICaixaDTO } from "@modules/financeiro/dtos/i-caixa-dto"
import { ICaixaRepository } from "@modules/financeiro/repositories/i-caixa-repository"
import { Caixa } from "@modules/financeiro/infra/typeorm/entities/caixa"
import { noContent, serverError, ok, notFound, HttpResponse } from "@shared/helpers"
import { AppError } from "@shared/errors/app-error"

class CaixaRepository implements ICaixaRepository {
    private repository: Repository<Caixa>

    constructor() {
        this.repository = getRepository(Caixa)
    }

    // create
    async create({ descricao, valor, data, pedidoId, clienteId, formaPagamentoId }: ICaixaDTO): Promise<HttpResponse> {
        const caixa = this.repository.create({
            descricao,
            valor,
            data,
            pedidoId,
            clienteId,
            formaPagamentoId,
        })

        const result = await this.repository
            .save(caixa)
            .then((caixaResult) => {
                return ok(caixaResult)
            })
            .catch((error) => {
                return serverError(error)
            })

        return result
    }

    async createWithQueryRunner(
        { descricao, valor, data, pedidoId, clienteId, formaPagamentoId }: ICaixaDTO,
        @TransactionManager() transactionManager: EntityManager
    ): Promise<HttpResponse> {
        const caixa = transactionManager.create(Caixa, {
            descricao,
            valor,
            data,
            pedidoId,
            clienteId,
            formaPagamentoId,
        })

        const result = await transactionManager
            .save(caixa)
            .then((caixaResult) => {
                return ok(caixaResult)
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

        const referenceArray = ["valor", "data"]
        const columnOrder = new Array<"ASC" | "DESC">(2).fill("ASC")

        const isDDMM = /^\d{2}\/\d{2}$/.test(search)
        const isDDMMYYYY = /^\d{2}\/\d{2}\/\d{4}$/.test(search)

        const index = referenceArray.indexOf(columnName)

        columnOrder[index] = columnDirection

        const offset = rowsPerPage * page

        try {
            let query = this.repository
                .createQueryBuilder("cai")
                .select([
                    'cai.id as "id"',
                    "CONCAT('R$ ', TO_CHAR(cai.valor, 'FM999G999G990D00')) as \"valor\"",
                    'cai.data as "data"',
                    'cai.descricao as "descricao"',
                ])

            if (filter) {
                query = query.where(filter)
            }

            const caixas = await query
                .andWhere(
                    new Brackets((query) => {
                        query.andWhere("CAST(cai.valor AS VARCHAR) ILIKE :search", { search: `%${search}%` })
                        query.orWhere("CAST(cai.descricao AS VARCHAR) ILIKE :search", { search: `%${search}%` })

                        if (isDDMM) {
                            query.orWhere("TO_CHAR(cai.data, 'DD/MM') ILIKE :search", { search: `%${search}%` })
                        } else if (isDDMMYYYY) {
                            query.orWhere("TO_CHAR(cai.data, 'DD/MM/YYYY') ILIKE :search", { search: `%${search}%` })
                        }
                    })
                )
                .orderBy("cai.data", "DESC")
                .offset(offset)
                .limit(rowsPerPage)
                .getRawMany()

            return ok(caixas)
        } catch (err) {
            return serverError(err)
        }
    }

    // select
    async select(filter: string): Promise<HttpResponse> {
        try {
            const caixas = await this.repository
                .createQueryBuilder("cai")
                .select(['cai.id as "value"', 'cai.valor as "label"'])
                .where("cai.valor ilike :filter", { filter: `${filter}%` })
                .addOrderBy("cai.valor")
                .getRawMany()

            return ok(caixas)
        } catch (err) {
            return serverError(err)
        }
    }

    // id select
    async idSelect(id: string): Promise<HttpResponse> {
        try {
            const caixa = await this.repository
                .createQueryBuilder("cai")
                .select(['cai.id as "value"', 'cai.valor as "label"'])
                .where("cai.id = :id", { id: `${id}` })
                .getRawOne()

            return ok(caixa)
        } catch (err) {
            return serverError(err)
        }
    }

    // count
    async count(search: string, filter: string): Promise<HttpResponse> {
        try {
            let query = this.repository.createQueryBuilder("cai").select(['cai.id as "id"'])

            if (filter) {
                query = query.where(filter)
            }

            const caixas = await query
                .andWhere(
                    new Brackets((query) => {
                        query.andWhere("CAST(cai.valor AS VARCHAR) ilike :search", { search: `%${search}%` })
                    })
                )
                .getRawMany()

            return ok({ count: caixas.length })
        } catch (err) {
            return serverError(err)
        }
    }

    // get
    async get(id: string): Promise<HttpResponse> {
        try {
            const caixa = await this.repository
                .createQueryBuilder("cai")
                .select([
                    'cai.id as "id"',
                    'cai.descricao as "descricao"',
                    'cai.valor as "valor"',
                    'cai.data as "data"',
                    'cai.pedidoId as "pedidoId"',
                    'cai.clienteId as "clienteId"',
                    'cai.formaPagamentoId as "formaPagamentoId"',
                ])
                .where("cai.id = :id", { id })
                .getRawOne()

            if (typeof caixa === "undefined") {
                return noContent()
            }

            return ok(caixa)
        } catch (err) {
            return serverError(err)
        }
    }

    async getByPedidoId(pedidoId: string): Promise<HttpResponse> {
        try {
            const caixa = await this.repository
                .createQueryBuilder("cai")
                .select([
                    'cai.id as "id"',
                    'cai.descricao as "descricao"',
                    'cai.valor as "valor"',
                    'cai.data as "data"',
                    'cai.pedidoId as "pedidoId"',
                    'cai.clienteId as "clienteId"',
                    'cai.formaPagamentoId as "formaPagamentoId"',
                ])
                .where("cai.pedidoId = :pedidoId", { pedidoId })
                .getRawOne()

            if (typeof caixa === "undefined") {
                return noContent()
            }

            return ok(caixa)
        } catch (error) {
            console.log(error)

            return serverError(error)
        }
    }

    // update
    async update({ id, descricao, valor, data, pedidoId, clienteId, formaPagamentoId }: ICaixaDTO): Promise<HttpResponse> {
        const caixa = await this.repository.findOne(id)

        if (!caixa) {
            return notFound()
        }

        const newcaixa = this.repository.create({
            id,
            descricao,
            valor,
            data,
            pedidoId,
            clienteId,
            formaPagamentoId,
        })

        try {
            await this.repository.save(newcaixa)

            return ok(newcaixa)
        } catch (err) {
            return serverError(err)
        }
    }

    async updateWithQueryRunner(
        { id, descricao, valor, data, pedidoId, clienteId, formaPagamentoId }: ICaixaDTO,
        @TransactionManager() transactionManager: EntityManager
    ): Promise<HttpResponse> {
        const caixa = await transactionManager.findOne(Caixa, id)

        if (!caixa) {
            return notFound()
        }

        const newcaixa = transactionManager.create(Caixa, {
            id,
            descricao,
            valor,
            data,
            pedidoId,
            clienteId,
            formaPagamentoId,
        })

        try {
            await transactionManager.save(newcaixa)

            return ok(newcaixa)
        } catch (err) {
            return serverError(err)
        }
    }

    // delete
    async delete(id: string): Promise<HttpResponse> {
        try {
            await this.repository.delete(id)

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
            await this.repository.delete(ids)

            return noContent()
        } catch (err) {
            if (err.message.slice(0, 10) === "null value") {
                throw new AppError("not null constraint", 404)
            }

            return serverError(err)
        }
    }
}

export { CaixaRepository }
