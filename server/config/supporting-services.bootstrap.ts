import { IProduct, Product } from "../models";
import { Config } from "./config";
import { CONST } from "../constants";
import { OrganizationType } from "../enumerations";

import * as superagent from "superagent";

const util = require('util');
var bcrypt = require('bcrypt');
import log = require('winston');
import { IdentityApiService } from "../services/identity.api.service";

// This is where we're going to bootstrap other services that we need to interact with.
// In this case we're talking to the identity service, and we need to make sure that it has the roles that we need.
export class SupportingServicesBootstrap {

    public static async seed() {
        
    }
}