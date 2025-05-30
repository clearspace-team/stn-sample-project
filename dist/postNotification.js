"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postNotification = void 0;
const node_notifier_1 = __importDefault(require("node-notifier"));
const postNotification = ({ trigger, handle, }) => {
    node_notifier_1.default.notify({
        title: "Screen Time Network",
        message: `${trigger} triggered for ${handle}`,
    });
};
exports.postNotification = postNotification;
