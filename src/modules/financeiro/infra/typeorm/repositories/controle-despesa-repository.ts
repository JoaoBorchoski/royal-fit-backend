import { Brackets, getRepository, Repository } from "typeorm"
import { IControleDespesaDTO } from "@modules/financeiro/dtos/i-controle-despesa-dto"
import { IControleDespesaRepository } from "@modules/financeiro/repositories/i-controle-despesa-repository"
import { ControleDespesa } from "@modules/financeiro/infra/typeorm/entities/controle-despesa"
import { noContent, serverError, ok, notFound, HttpResponse } from "@shared/helpers"
import { AppError } from "@shared/errors/app-error"

class ControleDespesaRepository implements IControleDespesaRepository {
    private repository: Repository<ControleDespesa>

    constructor() {
        this.repository = getRepository(ControleDespesa)
    }

    // create
    async create({
        dataEmissao,
        dataVencimento,
        descricao,
        valor,
        status,
        categoria,
        codigoBarras,
        pedidoId,
        clienteId,
        formaPagamentoId,
    }: IControleDespesaDTO): Promise<HttpResponse> {
        const controleDespesa = this.repository.create({
            dataEmissao,
            dataVencimento,
            descricao,
            valor,
            status,
            categoria,
            codigoBarras,
            pedidoId,
            clienteId,
            formaPagamentoId,
        })

        const result = await this.repository
            .save(controleDespesa)
            .then((controleDespesaResult) => {
                return ok(controleDespesaResult)
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

        const referenceArray = ["dataVencimento", "valor", "status"]
        const columnOrder = new Array<"ASC" | "DESC">(2).fill("ASC")

        const isDDMM = /^\d{2}\/\d{2}$/.test(search)
        const isDDMMYYYY = /^\d{2}\/\d{2}\/\d{4}$/.test(search)

        const index = referenceArray.indexOf(columnName)

        columnOrder[index] = columnDirection

        const offset = rowsPerPage * page

        try {
            let query = this.repository.createQueryBuilder("con").select([
                'con.id as "id"',
                'con.dataVencimento as "dataVencimento"',
                'con.valor as "valor"',
                `CASE 
                  WHEN con.status = 0 THEN 'Pendente' 
                  WHEN con.status = 1 THEN 'Pago' 
                  WHEN con.status = 2 THEN 'Cancelado' 
                  ELSE 'Desconhecido' 
                  END as "status"`,
                'con.descricao as "descricao"',
            ])

            if (filter) {
                query = query.where(filter)
            }

            const controleDespesas = await query
                .andWhere(
                    new Brackets((query) => {
                        query.andWhere("CAST(con.valor AS VARCHAR) ILIKE :search", { search: `%${search}%` })
                        query.orWhere("CAST(con.descricao AS VARCHAR) ILIKE :search", { search: `%${search}%` })

                        if (isDDMM) {
                            query.orWhere("TO_CHAR(con.dataVencimento, 'DD/MM') ILIKE :search", { search: `%${search}%` })
                        } else if (isDDMMYYYY) {
                            query.orWhere("TO_CHAR(con.dataVencimento, 'DD/MM/YYYY') ILIKE :search", { search: `%${search}%` })
                        }
                    })
                )
                .orderBy("con.dataVencimento", "DESC")
                .offset(offset)
                .limit(rowsPerPage)
                .take(rowsPerPage)
                .getRawMany()

            return ok(controleDespesas)
        } catch (err) {
            return serverError(err)
        }
    }

    // select
    async select(filter: string): Promise<HttpResponse> {
        try {
            const controleDespesas = await this.repository
                .createQueryBuilder("con")
                .select(['con.id as "value"', 'con.dataVencimento as "label"'])
                .where("con.dataVencimento ilike :filter", { filter: `${filter}%` })
                .addOrderBy("con.dataVencimento")
                .getRawMany()

            return ok(controleDespesas)
        } catch (err) {
            return serverError(err)
        }
    }

    // id select
    async idSelect(id: string): Promise<HttpResponse> {
        try {
            const controleDespesa = await this.repository
                .createQueryBuilder("con")
                .select(['con.id as "value"', 'con.dataVencimento as "label"'])
                .where("con.id = :id", { id: `${id}` })
                .getRawOne()

            return ok(controleDespesa)
        } catch (err) {
            return serverError(err)
        }
    }

    // count
    async count(search: string, filter: string): Promise<HttpResponse> {
        try {
            let query = this.repository.createQueryBuilder("con").select(['con.id as "id"'])

            if (filter) {
                query = query.where(filter)
            }

            const controleDespesas = await query
                .andWhere(
                    new Brackets((query) => {
                        query.andWhere("CAST(cast(con.dataVencimento as VARCHAR) AS VARCHAR) ilike :search", {
                            search: `%${search}%`,
                        })
                    })
                )
                .getRawMany()

            return ok({ count: controleDespesas.length })
        } catch (err) {
            return serverError(err)
        }
    }

    // get
    async get(id: string): Promise<HttpResponse> {
        try {
            const controleDespesa = await this.repository
                .createQueryBuilder("con")
                .select([
                    'con.id as "id"',
                    'con.dataEmissao as "dataEmissao"',
                    'con.dataVencimento as "dataVencimento"',
                    'con.descricao as "descricao"',
                    'con.valor as "valor"',
                    'con.status as "status"',
                    'con.categoria as "categoria"',
                    'con.codigoBarras as "codigoBarras"',
                    'con.pedidoId as "pedidoId"',
                    'con.clienteId as "clienteId"',
                    'con.formaPagamentoId as "formaPagamentoId"',
                ])
                .where("con.id = :id", { id })
                .getRawOne()

            if (typeof controleDespesa === "undefined") {
                return noContent()
            }

            return ok(controleDespesa)
        } catch (err) {
            return serverError(err)
        }
    }

    // update
    async update({
        id,
        dataEmissao,
        dataVencimento,
        descricao,
        valor,
        status,
        categoria,
        codigoBarras,
        pedidoId,
        clienteId,
        formaPagamentoId,
    }: IControleDespesaDTO): Promise<HttpResponse> {
        const controleDespesa = await this.repository.findOne(id)

        if (!controleDespesa) {
            return notFound()
        }

        const newcontroleDespesa = this.repository.create({
            id,
            dataEmissao,
            dataVencimento,
            descricao,
            valor,
            status,
            categoria,
            codigoBarras,
            pedidoId,
            clienteId,
            formaPagamentoId,
        })

        try {
            await this.repository.save(newcontroleDespesa)

            return ok(newcontroleDespesa)
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

export { ControleDespesaRepository }
