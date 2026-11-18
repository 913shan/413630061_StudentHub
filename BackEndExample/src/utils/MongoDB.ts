import { Schema, model, connect, Mongoose } from 'mongoose';
import { logger } from '../middlewares/log';
import { MongoInfo } from '../interfaces/MongoInfo';
export class MongoDB {

    DB: Mongoose | void | undefined
    isConneted : boolean = false;

    constructor(info: MongoInfo) {

        const url = `mongodb://${info.name}:${encodeURIComponent(info.password)}@${info.host}:${info.port}/${info.dbName}?authSource=${process.env.DBAUTHSOURCE || info.dbName}`;

        this.init(url).then(() => {

            logger.info("Connected to MongoDB");
            this.isConneted = true;

        }).catch(() => {

            logger.error("MongoDB connection failed");

        })

    }

    async init(url: string) {
        this.DB = await connect(url);
    }

    getState():boolean{
        return this.isConneted;
    }
}
