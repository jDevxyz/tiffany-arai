import { r, Connection, RDatabase, TableCreateOptions, RValue, RDatum, TableChangeResult, RTable, RCursor, RSingleSelection, RSelection } from "rethinkdb-ts"
import {EventEmitter} from "events"
import { AraiClient } from "./AraiClient";

export class RethinkController extends EventEmitter {
    protected ready: boolean = false
    public conn?: Connection
    constructor(private client: AraiClient) {
        super();
        this.build()
    }

    public async build(): Promise<Connection | void> {
        const options = {
            host: this.client.state.rethink.host,
            port: this.client.state.rethink.port
        }
        const conn = await r.connect(options)
        const db = await this.getdb(this.client.state.nickname.toLowerCase())

        this.conn = conn
        this.ready = true
        return conn
    }

    public async getdb(dbname: string): Promise<RDatabase> {
        const dbchecking = this.dbcheck(dbname)
        return r.db(dbname)
    }

    public async insert(tablename: string, data: any) {
        let result: any
        try {
            result = await r.table(tablename).insert(data).run(this.conn)
        } catch(e) {
            this.client.console.error("DATABASE ERROR: ", e)
        }
        return result
    }

    public async cursor(tablename: string): Promise<RCursor<any>>  {
        const cursor = await r.table(tablename).getCursor(this.conn)
        return cursor
    }

    public async update(tablename: string, data: any): Promise<any> {
        const update = await r.table(tablename).update(data).run(this.conn)
        return update
    }

    public async get(tablename: string, key: string): Promise<any> {
        const value = await r.table(tablename).get(key).run(this.conn)
        return value
    }

    public async delete(tablename: string, row: string, lt: number): Promise<any> {
        const deleted = await r.table(tablename).filter(r.row(row).count().lt(lt)).delete().run(this.conn)
        return deleted
    }

    protected async tablecheck(tablename: string) {
        await r.tableList().contains(tablename)
        .do(function(tableExist: RDatum<boolean>) {
            return r.branch(
                tableExist,
                { table_created: 0 },
                r.tableCreate(tablename)
            )
        }).run(this.conn)
    }

    protected async dbcheck(dbname: string) {
        await r.dbList().contains(dbname)
        .do(function(dbExist: RDatum<boolean>) {
            return r.branch(
                dbExist,
                { dbs_created: 0 },
                r.dbCreate(dbname)
            )
        }).run(this.conn)
    }
}
