"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = require("../utils");
dotenv_1.default.config();
describe('Utils', () => {
    describe('Base58', () => {
        it('Get discriminator', async () => {
            const hex = 
            //'c1209b3341d69c810e030000003d016400011a64010234640203402c420600000000e953780100000000500000'; // instruction discriminator 
            '04e2be442b0000000076dbd51500000000d5eb36c202000000'; // event discriminator
            const data = (0, utils_1.hexToUint8Array)(hex);
            console.log(data.slice(0, 8)); // instruction discriminator
            // console.log(data.slice(0, 16)); // event discriminator
        });
    });
});
//# sourceMappingURL=utils.test.js.map