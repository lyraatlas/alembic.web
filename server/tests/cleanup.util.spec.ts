//During the test the env variable is set to test
import * as chai from "chai";
import * as log from "winston";
import { Database } from "../config/database/database";
import {
  Bucket,
  BucketItem,
  EmailVerification,
  Notification,
  User
} from "../models";
import mongoose = require("mongoose");

let expect = chai.expect;
let should = chai.should();
chai.use(require("chai-http"));

export class Cleanup {
  public static async clearDatabase(removeUsers: boolean) {
    //await Database.connect();
    if (
      (process.env.NODE_ENV === "integration" ||
        process.env.NODE_ENV === "local") &&
      Database.databaseName.includes("integration")
    ) {
      log.info("Clearing the database.");
      await Notification.remove({});
      await Bucket.remove({});
      await BucketItem.remove({});
      // So the reeason that we have a flag here, is that we only want to remove the users at the end
      // otherwise when related items try to populate their users on them the call will fail.
      // for instance if we're trying to retrieve buckets, and their comments, and their user names.  If we have deleted them, then
      // we will fail on the retrieval of the related user data.
      if (removeUsers) {
        await User.remove({});
      }
      await EmailVerification.remove({});
      log.info("Database all clear");
    } else {
      throw "The clear database method is trying to be run against a database that isnt integration";
    }
  }
}
