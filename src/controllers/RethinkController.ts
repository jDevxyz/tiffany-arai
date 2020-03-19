import {
    r,
    Connection,
    RDatabase,
    TableCreateOptions,
    RValue,
    RDatum,
    TableChangeResult,
    RTable,
    RCursor,
    RSingleSelection,
    RSelection, WriteResult
} from "rethinkdb-ts"
import {EventEmitter} from "events"
import { AraiClient } from "./AraiClient";
import {ValueChange} from "rethinkdb-ts/lib/types";

export class RethinkController extends EventEmitter {
    protected ready: boolean = false;
    public conn?: Connection;
    public defaultDatabase?: RDatabase;
    constructor(private client: AraiClient) {
        super();
    }

    public async build(): Promise<Connection | void> {
        const options = {
            host: this.client.state.rethink.host,
            port: this.client.state.rethink.port
        };
        const conn = await r.connect(options);

        this.conn = conn;
        this.client.conn = conn;
        this.ready = true;
        return conn
    }

    public getdb(dbname: string): RDatabase {
        this.dbcheck(dbname).then();
        return r.db(dbname)
    }

    public async insert(tablename: string, data: any) {
        if (!this.ready) throw this.client.console.warn("DATABASE WARN: ", new Error("Database is not ready yet"));
        let result: any;
        try {
            result = await this.defaultDatabase!.table(tablename).insert(data).run(this.conn)
        } catch(e) {
            this.client.console.error("DATABASE ERROR: ", e)
        }
        return result
    }

    public async cursor(tablename: string): Promise<RCursor<any>>  {
        if (!this.ready) throw this.client.console.warn("DATABASE WARN: ", new Error("Database is not ready yet"));
        const [cursor] = await Promise.all([this.defaultDatabase!.table(tablename).getCursor(this.conn)]);
        return cursor
    }

    public async updateOne(tablename: string, key: string, data: any): Promise<WriteResult<any>> {
        if (!this.ready) throw this.client.console.warn("DATABASE WARN: ", new Error("Database is not ready yet"));
        const [update] = await Promise.all([this.defaultDatabase!.table(tablename).get(key).update(data).run(this.conn)]);
        return update
    }

    public async get(tablename: string, key: string): Promise<any> {
        if (!this.ready) throw this.client.console.warn("DATABASE WARN: ", new Error("Database is not ready yet"));
        const [value] = await Promise.all([this.defaultDatabase!.table(tablename).get(key).run(this.conn)]);
        value.delete = function() {

        };
        return value
    }

    public async deleteOne(tablename: string, key: string): Promise<any> {
        if (!this.ready) throw this.client.console.warn("DATABASE WARN: ", new Error("Database is not ready yet"));
        const [deleted] = await Promise.all([this.defaultDatabase!.table(tablename).get(key).delete().run(this.conn)]);
        return deleted
    }

    public async deleteAll(tablename: string): Promise<any> {
        if (!this.ready) throw this.client.console.warn("DATABASE WARN: ", new Error("Database is not ready yet"));
        const [deleted] = await Promise.all([this.defaultDatabase!.table(tablename).delete().run(this.conn)]);
        return deleted
    }

    public async deleteFiltered(tablename: string, filter: any): Promise<any> {
        if (!this.ready) throw this.client.console.warn("DATABASE WARN: ", new Error("Database is not ready yet"));
        const [deleted] = await Promise.all([this.defaultDatabase!.table(tablename).filter(filter).delete().run(this.conn)]);
        return deleted
    }

    protected async tablecheck(dbname: string, tablename: string) {
        this.dbcheck(dbname);
        const tablexist = await r.tableList().contains(tablename).run(this.conn);
        if (tablexist) return;
        await r.db(dbname).tableCreate(tablename).run(this.conn)
    }

    protected async dbcheck(dbname: string) {
        const dbexist = await r.dbList().contains(dbname).run(this.conn);
        if (dbexist) return;
        await r.dbCreate(dbname).run(this.conn)
    }
}
