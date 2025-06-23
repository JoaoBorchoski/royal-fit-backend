import { Brackets, getRepository, Repository } from "typeorm"
import { IFechamentoDTO } from "@modules/financeiro/dtos/i-fechamento-dto"
import { IFechamentoRepository } from "@modules/financeiro/repositories/i-fechamento-repository"
import { Fechamento } from "@modules/financeiro/infra/typeorm/entities/fechamento"
import { noContent, serverError, ok, notFound, HttpResponse } from "@shared/helpers"
import { AppError } from "@shared/errors/app-error"

class FechamentoRepository implements IFechamentoRepository {
    private repository: Repository<Fechamento>

    constructor() {
        this.repository = getRepository(Fechamento)
    }

    // create
    async create({ data, saldoInicial, saldoFinal, saldoEntradas, valorTotal }: IFechamentoDTO): Promise<HttpResponse> {
        const fechamento = this.repository.create({
            data,
            saldoInicial,
            saldoFinal,
            saldoEntradas,
            valorTotal,
        })

        const result = await this.repository
            .save(fechamento)
            .then((fechamentoResult) => {
                return ok(fechamentoResult)
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

        const referenceArray = ["saldoInicial", "saldoFinal", "saldoEntradas", "valorTotal"]
        const columnOrder = new Array<"ASC" | "DESC">(2).fill("ASC")

        const index = referenceArray.indexOf(columnName)

        columnOrder[index] = columnDirection

        const offset = rowsPerPage * page

        try {
            let query = this.repository
                .createQueryBuilder("fec")
                .select([
                    'fec.id as "id"',
                    'fec.saldoInicial as "saldoInicial"',
                    'fec.saldoFinal as "saldoFinal"',
                    'fec.saldoEntradas as "saldoEntradas"',
                    'fec.valorTotal as "valorTotal"',
                ])

            if (filter) {
                query = query.where(filter)
            }

            const fechamentos = await query
                .andWhere(
                    new Brackets((query) => {
                        query.andWhere("CAST(fec.saldoInicial AS VARCHAR) ilike :search", { search: `%${search}%` })
                    })
                )
                .addOrderBy("fec.saldoInicial", columnOrder[0])
                .addOrderBy("fec.saldoFinal", columnOrder[1])
                .addOrderBy("fec.saldoEntradas", columnOrder[2])
                .addOrderBy("fec.valorTotal", columnOrder[3])
                .offset(offset)
                .limit(rowsPerPage)
                .take(rowsPerPage)
                .getRawMany()

            return ok(fechamentos)
        } catch (err) {
            return serverError(err)
        }
    }

    // select
    async select(filter: string): Promise<HttpResponse> {
        try {
            const fechamentos = await this.repository
                .createQueryBuilder("fec")
                .select(['fec.id as "value"', 'fec.saldoInicial as "label"'])
                .where("fec.saldoInicial ilike :filter", { filter: `${filter}%` })
                .addOrderBy("fec.saldoInicial")
                .getRawMany()

            return ok(fechamentos)
        } catch (err) {
            return serverError(err)
        }
    }

    // id select
    async idSelect(id: string): Promise<HttpResponse> {
        try {
            const fechamento = await this.repository
                .createQueryBuilder("fec")
                .select(['fec.id as "value"', 'fec.saldoInicial as "label"'])
                .where("fec.id = :id", { id: `${id}` })
                .getRawOne()

            return ok(fechamento)
        } catch (err) {
            return serverError(err)
        }
    }

    // count
    async count(search: string, filter: string): Promise<HttpResponse> {
        try {
            let query = this.repository.createQueryBuilder("fec").select(['fec.id as "id"'])

            if (filter) {
                query = query.where(filter)
            }

            const fechamentos = await query
                .andWhere(
                    new Brackets((query) => {
                        query.andWhere("CAST(fec.saldoInicial AS VARCHAR) ilike :search", { search: `%${search}%` })
                    })
                )
                .getRawMany()

            return ok({ count: fechamentos.length })
        } catch (err) {
            return serverError(err)
        }
    }

    // get
    async get(id: string): Promise<HttpResponse> {
        try {
            const fechamento = await this.repository
                .createQueryBuilder("fec")
                .select([
                    'fec.id as "id"',
                    'fec.data as "data"',
                    'fec.saldoInicial as "saldoInicial"',
                    'fec.saldoFinal as "saldoFinal"',
                    'fec.saldoEntradas as "saldoEntradas"',
                    'fec.valorTotal as "valorTotal"',
                ])
                .where("fec.id = :id", { id })
                .getRawOne()

            if (typeof fechamento === "undefined") {
                return noContent()
            }

            return ok(fechamento)
        } catch (err) {
            return serverError(err)
        }
    }

    // update
    async update({ id, data, saldoInicial, saldoFinal, saldoEntradas, valorTotal }: IFechamentoDTO): Promise<HttpResponse> {
        const fechamento = await this.repository.findOne(id)

        if (!fechamento) {
            return notFound()
        }

        const newfechamento = this.repository.create({
            id,
            data,
            saldoInicial,
            saldoFinal,
            saldoEntradas,
            valorTotal,
        })

        try {
            await this.repository.save(newfechamento)

            return ok(newfechamento)
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

    async getData(): Promise<HttpResponse> {
        try {
            // const despesas = await this.repository.query(`
            //   SELECT
            //     cd.id as "id",
            //     cd.data_emissao as "data_emissao",
            //     cd.valor :: float as "valor",
            //     cd.descricao as "descricao",
            //     cd.categoria as "categoria",
            //     a.nome as "meio_pagamento"
            //   FROM
            //     controle_despesas as cd
            //   LEFT JOIN
            //     meios_pagamento as a ON cd.forma_pagamento_id = a.id::varchar
            //   WHERE
            //     cd.data_emissao = (SELECT MAX(data_emissao) FROM controle_despesas)
            //   `)

            // const entradas = await this.repository.query(`
            //     SELECT
            //       c.id as "id",
            //       c.data as "data",
            //       c.valor :: float as "valor",
            //       a.nome as "meio_pagamento"
            //     FROM
            //       caixa as c
            //     LEFT JOIN
            //       meios_pagamento as a ON c.forma_pagamento_id = a.id::varchar
            //     WHERE
            //       c.data = (SELECT MAX(data) FROM caixa)
            //     `)

            // const fechamento = {}

            // console.log("entradas", entradas)
            // console.log("despesas", despesas)

            // return ok(despesas)

            //   const despesas = await this.repository.query(`
            //     SELECT
            //       cd.id as "id",
            //       cd.data_emissao as "data",
            //       cd.valor :: float as "valor",
            //       cd.descricao as "descricao",
            //       cd.categoria as "categoria",
            //       a.nome as "meio_pagamento"
            //     FROM
            //       controle_despesas as cd
            //     LEFT JOIN
            //       meios_pagamento as a ON cd.forma_pagamento_id = a.id::varchar
            //     WHERE
            //       cd.data_emissao >= NOW() - INTERVAL '12 months'
            // `)

            //   const entradas = await this.repository.query(`
            //     SELECT
            //       c.id as "id",
            //       c.data as "data",
            //       c.valor :: float as "valor",
            //       a.nome as "meio_pagamento"
            //     FROM
            //       caixa as c
            //     LEFT JOIN
            //       meios_pagamento as a ON c.forma_pagamento_id = a.id::varchar
            //     WHERE
            //       c.data >= NOW() - INTERVAL '12 months'
            // `)

            //   function agruparPorPeriodo(dados, periodo) {
            //     return dados.reduce((acc, item) => {
            //       const data = new Date(item.data)
            //       let chave
            //       if (periodo === "mes") {
            //         chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`
            //       } else if (periodo === "semana") {
            //         const primeiraSemana = new Date(data.getFullYear(), 0, 1)
            //         const diff = (data.getTime() - primeiraSemana.getTime()) / 86400000
            //         const semana = Math.ceil((diff + primeiraSemana.getDay() + 1) / 7)
            //         chave = `${data.getFullYear()}-W${semana}`
            //       } else if (periodo === "dia") {
            //         chave = data.toISOString().split("T")[0]
            //       }
            //       acc[chave] = (acc[chave] || 0) + item.valor
            //       return acc
            //     }, {})
            //   }

            //   const despesasMensais = agruparPorPeriodo(despesas, "mes")
            //   const entradasMensais = agruparPorPeriodo(entradas, "mes")

            //   const despesasSemanais = agruparPorPeriodo(despesas, "semana")
            //   const entradasSemanais = agruparPorPeriodo(entradas, "semana")

            //   const despesasDiarias = agruparPorPeriodo(despesas, "dia")
            //   const entradasDiarias = agruparPorPeriodo(entradas, "dia")

            //   function calcularFechamentoDetalhado(entradas, despesas) {
            //     const todasChaves = new Set([...Object.keys(entradas), ...Object.keys(despesas)])

            //     return Array.from(todasChaves).reduce((acc, key) => {
            //       acc[key] = {
            //         caixa: entradas[key] || 0,
            //         controle_despesas: despesas[key] || 0,
            //         fechamento: (entradas[key] || 0) - (despesas[key] || 0),
            //       }
            //       return acc
            //     }, {})
            //   }

            //   const fechamento = {
            //     ultimos_12_meses: calcularFechamentoDetalhado(entradasMensais, despesasMensais),
            //     ultimas_4_semanas: calcularFechamentoDetalhado(entradasSemanais, despesasSemanais),
            //     ultimos_7_dias: calcularFechamentoDetalhado(entradasDiarias, despesasDiarias),
            //   }

            //   console.log("fechamento", fechamento)

            //   return ok(fechamento)

            const despesas = await this.repository.query(`
      SELECT 
        cd.id as "id", 
        cd.data_emissao as "data",
        cd.valor :: float as "valor",
        cd.descricao as "descricao",
        cd.categoria as "categoria",
        a.nome as "meio_pagamento"
      FROM 
        controle_despesas as cd
      LEFT JOIN 
        meios_pagamento as a ON cd.forma_pagamento_id = a.id::varchar
      WHERE 
        cd.data_emissao >= NOW() - INTERVAL '12 months'
    `)

            const entradas = await this.repository.query(`
      SELECT 
        c.id as "id", 
        c.data as "data",
        c.valor :: float as "valor",
        a.nome as "meio_pagamento"
      FROM 
        caixa as c
      LEFT JOIN 
        meios_pagamento as a ON c.forma_pagamento_id = a.id::varchar
      WHERE
        c.data >= NOW() - INTERVAL '12 months'
    `)

            function somarValores(dados) {
                return dados.reduce((total, item) => total + item.valor, 0)
            }

            // const hoje = new Date()
            // hoje.setUTCHours(0, 0, 0, 0) // Zera a hora para garantir que seja comparado apenas o dia

            // const inicioDosUltimos7Dias = new Date(hoje)
            // inicioDosUltimos7Dias.setUTCDate(inicioDosUltimos7Dias.getUTCDate() - 6) // Contando hoje + 6 dias para trás

            // // Função para normalizar a data vinda do banco e remover a hora
            // function normalizarDataBanco(dataBanco) {
            //   const dataNormalizada = new Date(dataBanco)
            //   dataNormalizada.setUTCHours(0, 0, 0, 0) // Zera a hora para comparação justa
            //   return dataNormalizada
            // }

            const totalDespesas12Meses = somarValores(despesas)
            const totalEntradas12Meses = somarValores(entradas)

            const despesasUltimas4Semanas = despesas.filter(
                (d) => new Date(d.data) >= new Date(Date.now() - 4 * 7 * 24 * 60 * 60 * 1000)
            )
            const entradasUltimas4Semanas = entradas.filter(
                (d) => new Date(d.data) >= new Date(Date.now() - 4 * 7 * 24 * 60 * 60 * 1000)
            )

            const totalDespesas4Semanas = somarValores(despesasUltimas4Semanas)
            const totalEntradas4Semanas = somarValores(entradasUltimas4Semanas)

            const despesasUltimos7Dias = despesas.filter(
                (d) => new Date(d.data) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            )
            const entradasUltimos7Dias = entradas.filter(
                (d) => new Date(d.data) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            )

            // const despesasUltimos7Dias = despesas.filter((d) => {
            //   const dataRegistro = normalizarDataBanco(d.data)
            //   return dataRegistro.getTime() >= inicioDosUltimos7Dias.getTime() && dataRegistro.getTime() <= hoje.getTime()
            // })
            // const entradasUltimos7Dias = entradas.filter((d) => {
            //   const dataRegistro = normalizarDataBanco(d.data)
            //   return dataRegistro.getTime() >= inicioDosUltimos7Dias.getTime() && dataRegistro.getTime() <= hoje.getTime()
            // })

            const totalDespesas7Dias = somarValores(despesasUltimos7Dias)
            const totalEntradas7Dias = somarValores(entradasUltimos7Dias)

            const despesasHoje = despesas.filter((d) => new Date(d.data).toDateString() === new Date().toDateString())
            const entradasHoje = entradas.filter((d) => new Date(d.data).toDateString() === new Date().toDateString())

            // const despesasHoje = despesas.filter((d) => normalizarDataBanco(d.data).getTime() === hoje.getTime())
            // const entradasHoje = entradas.filter((d) => normalizarDataBanco(d.data).getTime() === hoje.getTime())

            const totalDespesasHoje = somarValores(despesasHoje)
            const totalEntradasHoje = somarValores(entradasHoje)

            const fechamento = {
                ultimos_12_meses: {
                    caixa: totalEntradas12Meses,
                    controle_despesas: totalDespesas12Meses,
                    fechamento: totalEntradas12Meses - totalDespesas12Meses,
                },
                ultimas_4_semanas: {
                    caixa: totalEntradas4Semanas,
                    controle_despesas: totalDespesas4Semanas,
                    fechamento: totalEntradas4Semanas - totalDespesas4Semanas,
                },
                ultimos_7_dias: {
                    caixa: totalEntradas7Dias,
                    controle_despesas: totalDespesas7Dias,
                    fechamento: totalEntradas7Dias - totalDespesas7Dias,
                },
                hoje: {
                    caixa: totalEntradasHoje,
                    controle_despesas: totalDespesasHoje,
                    fechamento: totalEntradasHoje - totalDespesasHoje,
                },
            }

            return ok(fechamento)
        } catch (err) {
            console.log("err", err)
            return serverError(err)
        }
    }

    async getFechamentoRelatorio(type: string) {
        try {
            const despesas = await this.repository.query(`
        SELECT 
          cd.id as "id", 
          cd.data_emissao as "data",
          cd.valor :: float as "valor",
          cd.descricao as "descricao",
          a.nome as "meio_pagamento"
        FROM 
          controle_despesas as cd
        LEFT JOIN 
          meios_pagamento as a ON cd.forma_pagamento_id = a.id::varchar
        WHERE 
          cd.data_emissao >= NOW() - INTERVAL '12 months'
    `)

            const entradas = await this.repository.query(`
        SELECT 
          c.id as "id", 
          c.data as "data",
          c.valor :: float as "valor",
          c.descricao as "descricao",
          a.nome as "meio_pagamento"
        FROM 
          caixa as c
        LEFT JOIN 
          meios_pagamento as a ON c.forma_pagamento_id = a.id::varchar
        WHERE
          c.data >= NOW() - INTERVAL '12 months'
    `)

            function somarValores(dados) {
                return dados.reduce((total, item) => total + item.valor, 0)
            }

            function filtrarDadosPorPeriodo(dados, dias) {
                const dataLimite = new Date()
                dataLimite.setHours(0, 0, 0, 0)

                if (dias === 0) {
                    return dados.filter((d) => {
                        const dataRegistro = new Date(d.data)
                        dataRegistro.setHours(0, 0, 0, 0)
                        return dataRegistro.getTime() === dataLimite.getTime()
                    })
                }

                dataLimite.setDate(dataLimite.getDate() - dias)
                return dados.filter((d) => new Date(d.data) >= dataLimite)
            }

            const fechamento = {
                ultimos_12_meses: {
                    caixa: Number(somarValores(entradas).toFixed(2)),
                    controle_despesas: Number(somarValores(despesas).toFixed(2)),
                    fechamento: Number((somarValores(entradas) - somarValores(despesas)).toFixed(2)),
                    detalhes: {
                        entradas: entradas,
                        despesas: despesas,
                    },
                },
                ultimas_4_semanas: {
                    caixa: Number(somarValores(filtrarDadosPorPeriodo(entradas, 28)).toFixed(2)),
                    controle_despesas: Number(somarValores(filtrarDadosPorPeriodo(despesas, 28)).toFixed(2)),
                    fechamento: Number(
                        (
                            somarValores(filtrarDadosPorPeriodo(entradas, 28)) -
                            somarValores(filtrarDadosPorPeriodo(despesas, 28))
                        ).toFixed(2)
                    ),
                    detalhes: {
                        entradas: filtrarDadosPorPeriodo(entradas, 28),
                        despesas: filtrarDadosPorPeriodo(despesas, 28),
                    },
                },
                ultimos_7_dias: {
                    caixa: Number(somarValores(filtrarDadosPorPeriodo(entradas, 7)).toFixed(2)),
                    controle_despesas: Number(somarValores(filtrarDadosPorPeriodo(despesas, 7)).toFixed(2)),
                    fechamento: Number(
                        (
                            somarValores(filtrarDadosPorPeriodo(entradas, 7)) - somarValores(filtrarDadosPorPeriodo(despesas, 7))
                        ).toFixed(2)
                    ),
                    detalhes: {
                        entradas: filtrarDadosPorPeriodo(entradas, 7),
                        despesas: filtrarDadosPorPeriodo(despesas, 7),
                    },
                },
                hoje: {
                    caixa: Number(somarValores(filtrarDadosPorPeriodo(entradas, 0)).toFixed(2)),
                    controle_despesas: Number(somarValores(filtrarDadosPorPeriodo(despesas, 0)).toFixed(2)),
                    fechamento: Number(
                        (
                            somarValores(filtrarDadosPorPeriodo(entradas, 0)) - somarValores(filtrarDadosPorPeriodo(despesas, 0))
                        ).toFixed(2)
                    ),
                    detalhes: {
                        entradas: filtrarDadosPorPeriodo(entradas, 0),
                        despesas: filtrarDadosPorPeriodo(despesas, 0),
                    },
                },
            }

            return fechamento[type]
        } catch (error) {
            console.log("error", error)
            return serverError(error)
        }
    }

    async getFechamentoRelatorioDetalhado(type: string, payload: any) {
        try {
            let result

            if (type == "periodo") {
                const despesas = await this.repository.query(
                    `
                    SELECT
                      cd.id as "id",
                      cd.data_emissao as "data",
                      cd.valor :: float as "valor",
                      cd.descricao as "descricao",
                      a.nome as "meio_pagamento"
                    FROM
                      controle_despesas as cd
                    LEFT JOIN
                      meios_pagamento as a ON cd.forma_pagamento_id = a.id::varchar
                    WHERE
                      cd.data_emissao >= $1 AND cd.data_emissao <= $2
                  `,
                    [payload.dataInicio, payload.dataFim]
                )

                const entradas = await this.repository.query(
                    `
                    SELECT
                      c.id as "id",
                      c.data as "data",
                      c.descricao as "descricao",
                      c.valor :: float as "valor",
                      a.nome as "meio_pagamento"
                    FROM
                      caixa as c
                    LEFT JOIN
                      meios_pagamento as a ON c.forma_pagamento_id = a.id::varchar
                    WHERE
                      c.data >= $1 AND c.data <= $2
                  `,
                    [payload.dataInicio, payload.dataFim]
                )

                function somarValores(dados) {
                    return dados.reduce((total, item) => total + item.valor, 0)
                }

                const totalDespesas = Number(somarValores(despesas).toFixed(2))
                const totalEntradas = Number(somarValores(entradas).toFixed(2))

                result = {
                    caixa: totalEntradas,
                    controle_despesas: totalDespesas,
                    fechamento: Number((totalEntradas - totalDespesas).toFixed(2)),
                    detalhes: {
                        entradas: entradas,
                        despesas: despesas,
                    },
                }
            }

            if (type == "produto") {
                const fechamentoProd = await this.repository.query(
                    `
                    SELECT 
                        pi.id AS "item_id",
                        pedido.sequencial AS "sequencial",
                        pi.quantidade AS "quantidade",
                        pi.valor :: float AS "valor",
                        pedido.created_at AS "data_pedido",
                        p.nome AS "produto"
                    FROM pedido_itens pi
                    LEFT JOIN pedidos pedido 
                        ON pi.pedido_id = pedido.id
                    LEFT JOIN produtos p
                        ON pi.produto_id = p.id
                    WHERE 
                        pi.produto_id = $1
                        AND pedido.created_at >= $2
                        AND pedido.created_at <= $3
                    ORDER BY 
                        pedido.created_at ASC
                    `,
                    [payload.produtoId, payload.dataInicio, payload.dataFim]
                )

                result = fechamentoProd
            }

            if (type == "cliente") {
                const fechamentoCliente = await this.repository.query(
                    `
                    SELECT 
                        cx.id AS "id",
                        cx.descricao AS "descricao",
                        cx.valor::float AS "valor",
                        mp.nome AS "meio_pagamento",
                        c.nome AS "cliente",
                        cx.data AS "data"
                    FROM
                        caixa AS cx
                    LEFT JOIN 
                        clientes AS c ON c.id::varchar = cx.cliente_id 
                    LEFT JOIN
                        meios_pagamento AS mp ON cx.forma_pagamento_id = mp.id::varchar
                    WHERE
                        cx.cliente_id = $1::varchar  
                        AND cx.data >= $2
                        AND cx.data <= $3
                    ORDER BY
                        cx.created_at ASC
                    `,
                    [String(payload.clienteId), payload.dataInicio, payload.dataFim]
                )

                result = fechamentoCliente
            }

            return result
        } catch (error) {
            console.log("error", error)
            return serverError(error)
        }
    }
}

export { FechamentoRepository }
