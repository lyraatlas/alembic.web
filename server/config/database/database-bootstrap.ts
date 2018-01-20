import { IProduct, Product, OrderCounter } from "../../models";
import { Config } from "../config";
import { CONST } from "../../constants";
import { OrganizationType } from "../../enumerations";
const util = require('util');
var bcrypt = require('bcrypt');
import log = require('winston');
import { mongoose } from "./database";

export class DatabaseBootstrap {

    public static async seed() {
    }
}