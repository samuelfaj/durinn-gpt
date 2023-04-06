#!/usr/bin/env node

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DurinnGPT_1 = __importDefault(require("./classes/DurinnGPT"));
DurinnGPT_1.default.run();
console.log(process.env.PWD);
