import * as chai from 'chai';
import { suite, test } from "mocha-typescript";
import * as supertest from 'supertest';
import { DatabaseBootstrap } from "../config/database/database-bootstrap";
import { App } from '../server-entry';
import { AuthUtil } from "./authentication.util";
import { Cleanup } from "./cleanup.util.spec";


const api = supertest.agent(App.server);
const mongoose = require("mongoose");
//mongoose.set('debug', true);
const expect = chai.expect;
const should = chai.should();

@suite('Bootstrap Suite -> ')
class BootstrapTest {

    // First we need to get some users to work with from the identity service
    public static before(done) {
        console.log('Testing bootstrap');
        // This code should only be called if this test is run as a single test.  When run in the suite along with
        // product this code is run by the product test.
        App.server.on('dbConnected', async () => {
            console.log('Got the dbConnected Signal, so now we can clear, and seed the database.' )
            await Cleanup.clearDatabase(true);
            console.log('About to seed the database');
            await DatabaseBootstrap.seed();

            console.log('About to create identity test data.');
            // This will create, 2 users, an organization, and add the users to the correct roles.
            await AuthUtil.registerUser("dave2");
            await AuthUtil.Initialize();
            done();
        });
    }

    public static async after() {
        await Cleanup.clearDatabase(false);
    }

    @test('Just setting up a test for testing initialization')
    public async initialize() {
        expect(1).to.be.equal(1);
        return;
    }
}
