import * as chai from 'chai';
import { suite, test } from "mocha-typescript";
import * as supertest from 'supertest';
import { App } from '../../server-entry';
import { BijectionEncoder } from '../../utils/bijection-encoder';
import { Cleanup } from "../cleanup.util.spec";


const api = supertest.agent(App.server);
const mongoose = require("mongoose");
const expect = chai.expect;
const should = chai.should();

@suite('ID encoder test')
class IdEncoderTest {

    // First we need to get some users to work with from the identity service
    public static before(done) {
        console.log('Testing ID encoding and decoding');
        done();
    }

    // This guy doesn't do anything with the database, but the next test is expecting a clean database.
    public static async after() {
        await Cleanup.clearDatabase(false);
    }

    @test('Just setting up a test for testing initialization')
    public async initialize() {
        expect(1).to.be.equal(1);
        return;
    }

    @test('Making sure nothing has gone wrong with our order id encoder')
    public async idEncoderTest() {
        for (var index = 10000000; index < 10005000; index++) {
            expect(BijectionEncoder.decode(BijectionEncoder.encode(index))).to.equal(index);
        }
    }
}
