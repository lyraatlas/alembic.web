import mongoose = require('mongoose');
import { HealthStatus } from '../../health-status';
import { Config } from '../config';
import log = require('winston');
mongoose.Promise = require('bluebird'); 

export class Database {

    public static databaseName: string = '';
    public static async connect(): Promise<void> {

        const connectionOptions: any = { 
            useNewUrlParser: true,
            // These two setting should help remove the 'Mongoose Topology destroyed error`
            // sets how many times to try reconnecting
            reconnectTries: Number.MAX_VALUE,
            // sets the delay between every retry (milliseconds)
            reconnectInterval: 10000 
         }
         if(!HealthStatus.isDatabaseConnected){
             try{
                await mongoose.connect(Config.active.get('mongoConnectionString'), connectionOptions);
                this.databaseName = mongoose.connection.db.databaseName;

                log.info(`Connected To Mongo Database: ${mongoose.connection.db.databaseName}`);
                HealthStatus.isDatabaseConnected = true;
            }
            catch(err){
                log.info('error while trying to connect with mongodb', err);
                HealthStatus.isDatabaseConnected = false;
            }
        }
    }
}

export { mongoose };
