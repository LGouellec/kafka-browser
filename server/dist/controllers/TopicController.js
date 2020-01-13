"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TokenProvider_1 = __importDefault(require("../idp/TokenProvider"));
const KafkaClient_1 = __importDefault(require("../kafka/KafkaClient"));
class TopicController {
    getTopics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new KafkaClient_1.default();
            const tokenProvider = new TokenProvider_1.default();
            const t = req.header("authorization");
            const tokenInfo = tokenProvider.get(t);
            const topics = yield client.getAllTopics(tokenInfo.user, tokenInfo.password);
            res.send(topics);
        });
    }
    getConfig(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new KafkaClient_1.default();
            const tokenProvider = new TokenProvider_1.default();
            const t = req.header("authorization");
            const tokenInfo = tokenProvider.get(t);
            const configs = yield client.getConfig(tokenInfo.user, tokenInfo.password, req.params.topicName);
            res.send(configs);
        });
    }
    getOffsets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new KafkaClient_1.default();
            const tokenProvider = new TokenProvider_1.default();
            const t = req.header("authorization");
            const tokenInfo = tokenProvider.get(t);
            const offsets = yield client.getOffsets(tokenInfo.user, tokenInfo.password, req.params.topicName);
            res.send(offsets);
        });
    }
}
exports.TopicController = TopicController;
exports.default = TopicController;
//# sourceMappingURL=TopicController.js.map