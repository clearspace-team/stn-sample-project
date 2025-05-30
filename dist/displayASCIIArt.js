"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayASCIIArt = void 0;
const figlet_1 = __importDefault(require("figlet"));
const displayASCIIArt = (text) => {
    try {
        const asciiArt = figlet_1.default.textSync(text, {
            font: "Standard",
            horizontalLayout: "default",
            verticalLayout: "default",
        });
        console.log(asciiArt);
    }
    catch (error) {
        console.error("Error displaying ASCII art:", error);
    }
};
exports.displayASCIIArt = displayASCIIArt;
